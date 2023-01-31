/* eslint-disable @typescript-eslint/naming-convention */

import { StateContext } from '@ngxs/store';
import { IAttackParams, ICombatDelta, IGameCombat, Stat } from '../../../interfaces';
import { AddCombatLogMessage, SetCombatLock, SetCombatLockForEnemies } from '../../../stores/combat/combat.actions';
import { calculateAbilityDamageForUser, dispatchCorrectCombatEndEvent } from '../combat';

function singleTargetMeleeAttack(ctx: StateContext<IGameCombat>, opts: IAttackParams): { damage: number; deltas: ICombatDelta[] } {

  const { source, target, ability } = opts;

  const baseDamage = calculateAbilityDamageForUser(ability, source);
  const armor = target.stats[Stat.Armor];

  const damage = Math.max(0, baseDamage - armor);

  return {
    damage,
    deltas: [
      { target: 'target', attribute: 'currentHealth', delta: -damage }
    ]
  };
}

function singleTargetHeal(ctx: StateContext<IGameCombat>, opts: IAttackParams): { damage: number; deltas: ICombatDelta[] } {

  const { source, ability } = opts;

  const baseHeal = calculateAbilityDamageForUser(ability, source);
  const healingBonus = source.stats[Stat.Healing];

  const damage = Math.max(0, baseHeal + healingBonus);

  return {
    damage,
    deltas: [
      { target: 'target', attribute: 'currentHealth', delta: damage }
    ]
  };
}

export function BasicAttack(ctx: StateContext<IGameCombat>, opts: IAttackParams): ICombatDelta[] {

  const { source, target } = opts;
  const { damage, deltas } = singleTargetMeleeAttack(ctx, opts);

  ctx.dispatch(new AddCombatLogMessage(`${source.name} attacks ${target.name} for ${damage} damage!`));

  return [
    { target: 'source', attribute: 'currentEnergy', delta: 3 },
    ...deltas
  ];
}

export function UtilityEscape(ctx: StateContext<IGameCombat>, opts: IAttackParams): ICombatDelta[] {
  const encounter = ctx.getState().currentEncounter;
  if(!encounter) {
    return [];
  }

  ctx.dispatch([
    new SetCombatLock(true),
    new SetCombatLockForEnemies(true),
    new AddCombatLogMessage('You escaped successfully!')
  ]);

  setTimeout(() => {
    dispatchCorrectCombatEndEvent(ctx, encounter);
  }, 3000);

  return [];
}

export function SingleTargetAttack(ctx: StateContext<IGameCombat>, opts: IAttackParams): ICombatDelta[] {

  const { source, target, ability } = opts;
  const { damage, deltas } = singleTargetMeleeAttack(ctx, opts);

  ctx.dispatch(new AddCombatLogMessage(`${source.name} used "${ability.name}" on ${target.name} and dealt ${damage} damage!`));

  return [
    ...deltas
  ];
}

export function SingleTargetHeal(ctx: StateContext<IGameCombat>, opts: IAttackParams): ICombatDelta[] {

  const { source, target, ability } = opts;
  const { damage, deltas } = singleTargetHeal(ctx, opts);

  ctx.dispatch(new AddCombatLogMessage(`${source.name} used "${ability.name}" on ${target.name} and healed ${damage} health!`));

  return [
    ...deltas
  ];
}
