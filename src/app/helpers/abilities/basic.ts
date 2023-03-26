/* eslint-disable @typescript-eslint/naming-convention */

import { StateContext } from '@ngxs/store';
import { IAttackParams, ICombatDelta, IGameCombat, Stat } from '../../../interfaces';
import { AddCombatLogMessage, SetCombatLock, SetCombatLockForEnemies, StartCombatEndProcess } from '../../../stores/combat/combat.actions';
import { GainPercentageOfDungeonLoot, LeaveDungeon } from '../../../stores/combat/dungeon.actions';
import { calculateAbilityDamageForUser } from '../combat';
import { getStat } from '../stats';

function singleTargetMeleeAttack(ctx: StateContext<IGameCombat>, opts: IAttackParams): { damage: number; deltas: ICombatDelta[] } {

  const { source, target, ability } = opts;

  const baseDamage = calculateAbilityDamageForUser(ability, opts.useStats);
  const armor = opts.allowBonusStats ? Math.max(0, getStat(target.stats, Stat.Armor)) : 0;
  const mitigation = opts.allowBonusStats ? Math.min(75, Math.max(0, getStat(target.stats, Stat.Mitigation))) : 0;

  const unmitigatedDamage = baseDamage - armor;
  const mitigatedDamage = (mitigation / 100) * baseDamage;
  const damage = Math.max(0, unmitigatedDamage - mitigatedDamage);

  return {
    damage,
    deltas: [
      { target: 'target', attribute: 'currentHealth', delta: -damage }
    ]
  };
}

function singleTargetHeal(ctx: StateContext<IGameCombat>, opts: IAttackParams): { damage: number; deltas: ICombatDelta[] } {

  const { source, ability } = opts;

  const baseHeal = calculateAbilityDamageForUser(ability, opts.useStats);
  const healingBonus = opts.allowBonusStats ? getStat(source.stats, Stat.Healing) : 0;

  const damage = Math.max(0, baseHeal + healingBonus);

  return {
    damage,
    deltas: [
      { target: 'target', attribute: 'currentHealth', delta: damage }
    ]
  };
}

function singleTargetEnergyHeal(ctx: StateContext<IGameCombat>, opts: IAttackParams): { damage: number; deltas: ICombatDelta[] } {

  const { source, ability } = opts;

  const baseHeal = calculateAbilityDamageForUser(ability, opts.useStats);
  const healingBonus = opts.allowBonusStats ? getStat(source.stats, Stat.EnergyHealing) : 0;

  const damage = Math.max(0, baseHeal + healingBonus);

  return {
    damage,
    deltas: [
      { target: 'target', attribute: 'currentEnergy', delta: damage }
    ]
  };
}

export function BasicAttack(ctx: StateContext<IGameCombat>, opts: IAttackParams): { deltas: ICombatDelta[] } {

  const { source, target } = opts;
  const { damage, deltas } = singleTargetMeleeAttack(ctx, opts);

  ctx.dispatch(new AddCombatLogMessage(`${source.name} attacks ${target.name} for ${damage} damage!`));

  return { deltas: [
    { target: 'source', attribute: 'currentEnergy', delta: 3 },
    ...deltas
  ] };
}

export function UtilityEscape(ctx: StateContext<IGameCombat>, opts: IAttackParams): { deltas: ICombatDelta[]; skipTurnEnd?: boolean } {
  const encounter = ctx.getState().currentEncounter;
  if(!encounter) {
    return { deltas: [] };
  }

  ctx.dispatch([
    new SetCombatLock(true),
    new SetCombatLockForEnemies(true),
    new StartCombatEndProcess(),
    new AddCombatLogMessage('You escaped successfully!'),
    new GainPercentageOfDungeonLoot(70),
    new LeaveDungeon()
  ]);

  return { deltas: [], skipTurnEnd: true };
}

export function SingleTargetAttack(ctx: StateContext<IGameCombat>, opts: IAttackParams): { deltas: ICombatDelta[] } {

  const { source, target, ability } = opts;
  const { damage, deltas } = singleTargetMeleeAttack(ctx, opts);

  ctx.dispatch(new AddCombatLogMessage(`${source.name} used "${ability.name}" on ${target.name} and dealt ${damage} damage!`));

  return { deltas: [
    ...deltas
  ] };
}

export function SingleTargetHeal(ctx: StateContext<IGameCombat>, opts: IAttackParams): { deltas: ICombatDelta[] } {

  const { source, target, ability } = opts;
  const { damage, deltas } = singleTargetHeal(ctx, opts);

  ctx.dispatch(new AddCombatLogMessage(`${source.name} used "${ability.name}" on ${target.name} and healed ${damage} health!`));

  return { deltas: [
    ...deltas
  ] };
}

export function SingleTargetEnergyHeal(ctx: StateContext<IGameCombat>, opts: IAttackParams): { deltas: ICombatDelta[] } {

  const { source, target, ability } = opts;
  const { damage, deltas } = singleTargetEnergyHeal(ctx, opts);

  ctx.dispatch(new AddCombatLogMessage(`${source.name} used "${ability.name}" on ${target.name} and restored ${damage} energy!`));

  return { deltas: [
    ...deltas
  ] };
}

export function ApplyEffect(ctx: StateContext<IGameCombat>, opts: IAttackParams): { deltas: ICombatDelta[] } {

  const { source, target, ability, statusEffect } = opts;

  ctx.dispatch(new AddCombatLogMessage(`${source.name} used "${ability.name}" on ${target.name}!`));

  if(statusEffect) {
    return { deltas: [
      { target: 'target', attribute: '', applyStatusEffect: statusEffect, delta: 0 }
    ] };
  }

  return { deltas: [] };
}
