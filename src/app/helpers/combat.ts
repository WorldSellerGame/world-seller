import { StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { clamp, merge, random, sum } from 'lodash';
import * as CombatActions from '../../app/helpers/abilities';
import {
  AchievementStat,
  IAttackParams, ICombatDelta, IGameCombat, IGameCombatAbility,
  IGameEncounter, IGameEncounterCharacter, IGameItem, IGameStatusEffect, IPlayerCharacter, ItemType, Stat
} from '../../interfaces';
import { IncrementStat } from '../../stores/achievements/achievements.actions';
import { DecreaseDurability } from '../../stores/charselect/charselect.actions';
import {
  AddCombatLogMessage, ChangeThreats,
  EndCombat, EndCombatAndResetPlayer, SetCombatLock, SetCombatLockForEnemies, StartCombatEndProcess
} from '../../stores/combat/combat.actions';
import { GainPercentageOfDungeonLoot, LeaveDungeon } from '../../stores/combat/dungeon.actions';
import { PlaySFX } from '../../stores/game/game.actions';
import { calculateEnergyFromState, calculateHealthFromState, defaultStatsZero, getStat, getStatTotals } from './stats';

const allCombatActions: Record<string,
(ctx: StateContext<IGameCombat>, args: IAttackParams) => { deltas: ICombatDelta[]; skipTurnEnd?: boolean }
> = CombatActions;

export function getCombatFunction(action: string):
(ctx: StateContext<IGameCombat>, args: IAttackParams) => { deltas: ICombatDelta[]; skipTurnEnd?: boolean } {
  return allCombatActions[action];
}

export function calculateAbilityDamageForUser(ability: IGameCombatAbility, stats: Record<Stat, number>): number {
  const totalAbilityValue = sum(ability.stats.map(stat => {
    const baseValue = stats[stat.stat] * stat.multiplier;
    const bonusValue = stat.bonus ?? 0;
    const variance = Math.floor(baseValue * stat.variance);
    const varianceValue = random(-variance, variance);

    return baseValue + varianceValue + bonusValue;
  }));

  return Math.max(0, Math.floor(totalAbilityValue));
}

export function getSkillsFromItems(items: Record<string, IGameItem>): string[] {
  return Object.values(items).map(item => item?.givesPlayerAbility || '').filter(Boolean);
}

export function dispatchCorrectCombatEndEvent(ctx: StateContext<IGameCombat>, encounter: IGameEncounter) {

  const durabilityLosses = [
    ItemType.ChestArmor, ItemType.FootArmor, ItemType.HandArmor,
    ItemType.HeadArmor, ItemType.LegArmor, ItemType.Jewelry, ItemType.Weapon
  ].map(type => new DecreaseDurability(type));

  if(encounter.shouldResetPlayer) {
    ctx.dispatch([new EndCombatAndResetPlayer(), new ChangeThreats(), ...durabilityLosses]);
    return;
  }

  ctx.dispatch([new EndCombat(), new ChangeThreats(), ...durabilityLosses]);
}

function hasPlayerWonCombat(ctx: StateContext<IGameCombat>): boolean {

  const encounter = ctx.getState().currentEncounter;
  if(!encounter) {
    return false;
  }

  return encounter.enemies.every(e => e.currentHealth <= 0);
}

export function hasEnemyWonCombat(ctx: StateContext<IGameCombat>): boolean {

  const currentPlayer = ctx.getState().currentPlayer;
  if(!currentPlayer) {
    return false;
  }

  return currentPlayer.currentHealth <= 0;
}

export function hasAnyoneWonCombat(ctx: StateContext<IGameCombat>): boolean {
  return hasPlayerWonCombat(ctx) || hasEnemyWonCombat(ctx);
}

export function handleCombatEnd(ctx: StateContext<IGameCombat>) {

  const { currentEncounter, currentDungeon, level } = ctx.getState();
  if(!currentEncounter) {
    return;
  }

  if(currentEncounter.isDone) {
    return;
  }

  if(hasPlayerWonCombat(ctx)) {
    ctx.dispatch([
      new AddCombatLogMessage('You have won combat!'),
      new PlaySFX('combat-win'),
      new IncrementStat(AchievementStat.CombatThreatsBeaten)
    ]);

    let shouldGiveSkillPoint = currentEncounter.shouldGiveSkillPoint;

    // if we're leaving the dungeon on win, do that and level up
    if(currentEncounter.shouldExitDungeon) {
      if(((currentDungeon?.dungeon.givesPointAtCombatLevel ?? 0) + 10) > level) {
        shouldGiveSkillPoint = true;
      }

      ctx.dispatch([
        new GainPercentageOfDungeonLoot(100),
        new LeaveDungeon(),
        new IncrementStat(`Dungeon${level}`),
        new IncrementStat(AchievementStat.CombatDungeonsWon),
        new PlaySFX('dungeon-win')
      ]);
    }

    // can I get a levelup?
    if(shouldGiveSkillPoint) {
      ctx.setState(patch<IGameCombat>({
        level: level + 1
      }));

      ctx.dispatch(new AddCombatLogMessage(`Your combat is now level ${level + 1}!`));
    }

  } else if(hasEnemyWonCombat(ctx)) {
    ctx.dispatch([
      new AddCombatLogMessage('You have lost combat!'),
      new PlaySFX('combat-lose'),
      new IncrementStat(AchievementStat.Deaths)
    ]);

    if(currentDungeon) {
      ctx.dispatch([
        new GainPercentageOfDungeonLoot(30),
        new LeaveDungeon()
      ]);
    }
  }

  ctx.dispatch([new SetCombatLock(true), new SetCombatLockForEnemies(true), new StartCombatEndProcess()]);
}

export function isDead(character: IGameEncounterCharacter): boolean {
  return character.currentHealth <= 0;
}

/**
 * Apply a delta to a character. Currently only supports health and energy changing.
 */
export function applyDelta(character: IGameEncounterCharacter, appliedDelta: ICombatDelta): IGameEncounterCharacter {
  const { attribute, applyStatusEffect, unapplyStatusEffect } = appliedDelta;
  const delta = isNaN(appliedDelta.delta) ? 0 : appliedDelta.delta;

  if(attribute) {
    switch(attribute) {
      case 'currentHealth': {
        character.currentHealth = clamp(character.currentHealth + delta, 0, character.maxHealth);
        break;
      }

      case 'currentEnergy': {
        character.currentEnergy = clamp(character.currentEnergy + delta, 0, character.maxEnergy);
        break;
      }
    }
  }

  if(applyStatusEffect) {
    character.statusEffects.push(applyStatusEffect);

    const statMods = applyStatusEffect.statModifications || {};
    if(statMods) {
      Object.keys(statMods).forEach(key => {
        const bonus = (statMods?.[key as Stat] ?? 0);
        const bonusValue = isNaN(bonus) ? 0 : bonus;

        switch(key) {
          case 'healthBonus': {
            character.maxHealth = Math.floor(character.maxHealth + bonusValue);
            character.currentHealth = Math.floor(character.currentHealth + bonusValue);
            break;
          }

          case 'energyBonus': {
            character.maxEnergy = Math.floor(character.maxEnergy + bonusValue);
            character.currentEnergy = Math.floor(character.currentEnergy + bonusValue);
            break;
          }

          default: {
            // double check so when applying a buff the stat doesn't go below 1
            // this prevents a bug that would make the base stat larger when the buff unapplies
            const baseStat = getStat(character.stats, key as Stat);
            const appliedValue = baseStat + bonusValue;

            if(appliedValue <= 0) {
              applyStatusEffect.statModifications[key as Stat] = bonusValue - appliedValue + 1;
            }

            character.stats[key as Stat] = Math.max(getStat(character.stats, key as Stat) + bonusValue, 1);
            break;
          }
        }
      });
    }
  }

  if(unapplyStatusEffect) {
    character.statusEffects = character.statusEffects.filter(effect => effect !== unapplyStatusEffect);

    const statMods = unapplyStatusEffect.statModifications || {};
    if(statMods) {
      Object.keys(statMods).forEach(key => {
        const bonus = (statMods?.[key as Stat] ?? 0);
        const bonusValue = isNaN(bonus) ? 0 : bonus;

        switch(key) {
          case 'healthBonus': {
            character.maxHealth = Math.floor(character.maxHealth - bonusValue);
            character.currentHealth = Math.min(character.maxHealth, character.currentHealth);
            break;
          }

          case 'energyBonus': {
            character.maxEnergy = Math.floor(character.maxEnergy - bonusValue);
            character.currentEnergy = Math.min(character.maxEnergy, character.currentEnergy);
            break;
          }

          default: {
            const statsThatStayAt1 = [Stat.Speed];
            character.stats[key as Stat] = Math.max(
              getStat(character.stats, key as Stat) - bonusValue,
              statsThatStayAt1.includes(key as Stat) ? 1 : 0
            );
            break;
          }
        }
      });
    }
  }

  return character;
}

/**
 * Apply multiple deltas between source and target.
 */
export function applyDeltas(
  ctx: StateContext<IGameCombat>,
  sourceRef: IGameEncounterCharacter,
  targetRef: IGameEncounterCharacter,
  deltas: ICombatDelta[]
) {

  const state = ctx.getState();

  deltas.forEach(deltaToApply => {
    const { target } = deltaToApply;

    const trueTarget = target === 'source' ? sourceRef : targetRef;

    // if we target ourselves with an effect, we offset turns by 1 so it doesn't get slurped up immediately
    if(targetRef === sourceRef && deltaToApply.applyStatusEffect) {
      deltaToApply.applyStatusEffect.turnsLeft += 1;
    }

    if(state.currentPlayer === trueTarget) {
      const newPlayer = applyDelta(state.currentPlayer, deltaToApply);
      ctx.setState(patch<IGameCombat>({
        currentPlayer: newPlayer
      }));

      return;
    }

    state.currentEncounter?.enemies.forEach((enemy, index) => {
      if(enemy !== trueTarget) {
        return;
      }

      const newEnemy = applyDelta(enemy, deltaToApply);
      ctx.setState(patch<IGameCombat>({
        currentEncounter: patch<IGameEncounter>({
          enemies: updateItem<IGameEncounterCharacter>(index, newEnemy)
        })
      }));
    });
  });
}

export function getPlayerCharacterReadyForCombat(
  store: any,
  ctx: StateContext<IGameCombat>,
  activePlayer: IPlayerCharacter,
  bonusStats: Partial<Record<Stat, number>> = {},
  bonusEffects: IGameStatusEffect[] = []
): IGameEncounterCharacter {
  const state = ctx.getState();

  const stats = merge(defaultStatsZero(), getStatTotals(store, activePlayer));

  Object.keys(bonusStats).forEach(stat => {
    stats[stat as Stat] += (bonusStats[stat as Stat] || 0);
  });

  const character = {
    name: activePlayer.name,
    icon: 'me',
    abilities: [
      'BasicAttack', 'BasicUtilityEscape',
      ...getSkillsFromItems(activePlayer.equipment),
      ...state.activeSkills.filter(Boolean)
    ],

    stats,
    cooldowns: {},
    idleChance: 0,
    statusEffects: [],
    drops: [],
    currentSpeed: 0,
    currentHealth: calculateHealthFromState(store, activePlayer),
    maxHealth: calculateHealthFromState(store, activePlayer),
    currentEnergy: calculateEnergyFromState(store, activePlayer),
    maxEnergy: calculateEnergyFromState(store, activePlayer),
  };

  const appliedEffects: ICombatDelta[] = bonusEffects.map(x => ({ target: 'target', attribute: '', applyStatusEffect: x, delta: 0 }));

  let returnedCharacter: IGameEncounterCharacter = character;
  appliedEffects.forEach(delta => {
    returnedCharacter = applyDelta(returnedCharacter, delta);
  });

  return returnedCharacter;
}
