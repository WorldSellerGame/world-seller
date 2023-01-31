import { StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { clamp, random, sum } from 'lodash';
import * as CombatActions from '../../app/helpers/abilities';
import {
  IAttackParams, ICombatDelta, IGameCombat, IGameCombatAbility,
  IGameEncounter, IGameEncounterCharacter, IGameItem, ItemType
} from '../../interfaces';
import { DecreaseDurability } from '../../stores/charselect/charselect.actions';
import { AddCombatLogMessage, ChangeThreats, EndCombat, EndCombatAndResetPlayer, SetCombatLock } from '../../stores/combat/combat.actions';

const allCombatActions: Record<string, (ctx: StateContext<IGameCombat>, args: IAttackParams) => ICombatDelta[]> = CombatActions;

export function getCombatFunction(action: string): (ctx: StateContext<IGameCombat>, args: IAttackParams) => ICombatDelta[] {
  return allCombatActions[action];
}

export function calculateAbilityDamageForUser(ability: IGameCombatAbility, user: IGameEncounterCharacter): number {
  const totalAbilityValue = sum(ability.stats.map(stat => {
    const baseValue = user.stats[stat.stat] * stat.multiplier;
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

  const { currentEncounter, level } = ctx.getState();
  if(!currentEncounter) {
    return;
  }

  if(hasPlayerWonCombat(ctx)) {
    ctx.dispatch(new AddCombatLogMessage('You have won combat!'));

    // can I get a levelup?
    if(currentEncounter.shouldGiveSkillPoint) {
      ctx.setState(patch<IGameCombat>({
        level: level + 1
      }));

      ctx.dispatch(new AddCombatLogMessage(`Your combat is now level ${level + 1}!`));
    }

  } else if(hasEnemyWonCombat(ctx)) {
    ctx.dispatch(new AddCombatLogMessage('You have lost combat!'));
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
  const { attribute, delta } = appliedDelta;

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
