import { StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { clamp, merge, random, sum } from 'lodash';
import * as CombatActions from '../../app/helpers/abilities';
import {
  IAttackParams, ICombatDelta, IGameCombat, IGameCombatAbility,
  IGameEncounter, IGameEncounterCharacter, IGameItem, IPlayerCharacter, ItemType, Stat
} from '../../interfaces';
import { DecreaseDurability } from '../../stores/charselect/charselect.actions';
import { AddCombatLogMessage, ChangeThreats, EndCombat, EndCombatAndResetPlayer, SetCombatLock } from '../../stores/combat/combat.actions';
import { GainPercentageOfDungeonLoot, LeaveDungeon } from '../../stores/combat/dungeon.actions';
import { calculateMaxEnergy, calculateMaxHealth, defaultStatsZero, getStatTotals } from './stats';

const allCombatActions: Record<string, (ctx: StateContext<IGameCombat>, args: IAttackParams) => ICombatDelta[]> = CombatActions;

export function getCombatFunction(action: string): (ctx: StateContext<IGameCombat>, args: IAttackParams) => ICombatDelta[] {
  return allCombatActions[action];
}

export function calculateAbilityDamageForUser(ability: IGameCombatAbility, stats: Record<Stat, number>): number {
  const totalAbilityValue = sum(ability.stats.map(stat => {
    const baseValue = stats[stat.stat] * stat.multiplier;
    const variance = Math.floor(baseValue * stat.variance);
    const varianceValue = random(-variance, variance);

    return baseValue + varianceValue;
  }));

  return Math.max(0, Math.floor(totalAbilityValue));
}

export function getSkillsFromItems(items: Record<string, IGameItem>): string[] {
  return Object.values(items).map(item => item?.givesAbility || '').filter(Boolean);
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

  if(hasPlayerWonCombat(ctx)) {
    ctx.dispatch(new AddCombatLogMessage('You have won combat!'));

    // if we're leaving the dungeon on win, do that and level up
    if(currentEncounter.shouldExitDungeon) {
      if(currentDungeon?.dungeon.givesPointAtCombatLevel === level) {
        ctx.setState(patch<IGameCombat>({
          level: level + 1
        }));
      }

      ctx.dispatch([
        new GainPercentageOfDungeonLoot(100),
        new LeaveDungeon()
      ]);
    }

    // can I get a levelup?
    if(currentEncounter.shouldGiveSkillPoint) {
      ctx.setState(patch<IGameCombat>({
        level: level + 1
      }));

      ctx.dispatch(new AddCombatLogMessage(`Your combat is now level ${level + 1}!`));
    }

  } else if(hasEnemyWonCombat(ctx)) {
    ctx.dispatch(new AddCombatLogMessage('You have lost combat!'));

    if(currentDungeon) {
      ctx.dispatch([
        new GainPercentageOfDungeonLoot(30),
        new LeaveDungeon()
      ]);
    }
  }

  ctx.dispatch(new SetCombatLock(true));

  setTimeout(() => {
    dispatchCorrectCombatEndEvent(ctx, currentEncounter);
  }, 3000);
}

export function isDead(character: IGameEncounterCharacter): boolean {
  return character.currentHealth <= 0;
}

/**
 * Apply a delta to a character. Currently only supports health and energy changing.
 */
export function applyDelta(character: IGameEncounterCharacter, appliedDelta: ICombatDelta): IGameEncounterCharacter {
  const { attribute, delta, applyStatusEffect, unapplyStatusEffect } = appliedDelta;

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
        character.stats[key as Stat] = Math.max(character.stats[key as Stat] + (statMods?.[key as Stat] ?? 0), 1);
      });
    }
  }

  if(unapplyStatusEffect) {
    character.statusEffects = character.statusEffects.filter(effect => effect !== unapplyStatusEffect);

    const statMods = unapplyStatusEffect.statModifications || {};
    if(statMods) {
      Object.keys(statMods).forEach(key => {
        character.stats[key as Stat] = Math.max(character.stats[key as Stat] - (statMods?.[key as Stat] ?? 0), 1);
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

export function getPlayerCharacterReadyForCombat(ctx: StateContext<IGameCombat>, activePlayer: IPlayerCharacter): IGameEncounterCharacter {
  const state = ctx.getState();

  const stats = merge(defaultStatsZero(), getStatTotals(activePlayer));

  state.activeFoods.forEach(food => {
    if(!food) {
      return;
    }

    const foodStats = food.stats;
    if(!foodStats) {
      return;
    }

    Object.keys(foodStats).forEach(stat => {
      stats[stat as Stat] += foodStats[stat as Stat];
    });
  });

  return {
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
    currentEnergy: calculateMaxEnergy(activePlayer),
    maxEnergy: calculateMaxEnergy(activePlayer),
    currentHealth: calculateMaxHealth(activePlayer),
    maxHealth: calculateMaxHealth(activePlayer)
  };
}
