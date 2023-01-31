import { StateContext } from '@ngxs/store';

import { patch, updateItem } from '@ngxs/store/operators';
import { IGameCombat, IGameEncounter, IGameEncounterCharacter, Stat } from '../../interfaces';
import {
  AddCombatLogMessage, EnemyCooldownSkill, EnemySpeedReset,
  LowerEnemyCooldown, LowerPlayerCooldown, PlayerCooldownSkill, PlayerSpeedReset, SetCombatLock,
  SetCombatLockForEnemies,
  SetSkill, TargetEnemyWithAbility, TargetSelfWithAbility
} from './combat.actions';

import { GainJobResult } from '../charselect/charselect.actions';

import { applyDeltas, getCombatFunction, handleCombatEnd, hasAnyoneWonCombat, isDead } from '../../app/helpers';

export const defaultCombat: () => IGameCombat = () => ({
  version: 0,
  level: 0,
  activeSkills: [],
  currentDungeon: undefined,
  currentEncounter: undefined,
  currentPlayer: undefined,
  threatChangeTicks: 3600,
  threats: []
});

export function resetCombat(ctx: StateContext<IGameCombat>) {
  ctx.setState(defaultCombat());
}

/**
 * End the current combat but do not reset the player stats (in case of subsequent fights).
 *
 */
export function endCombat(ctx: StateContext<IGameCombat>) {
  ctx.setState(patch<IGameCombat>({
    currentEncounter: undefined
  }));
}

/**
 * End the combat and reset the player (for one-off battles).
 */
export function endCombatAndResetPlayer(ctx: StateContext<IGameCombat>) {
  ctx.setState(patch<IGameCombat>({
    currentPlayer: undefined,
    currentEncounter: undefined
  }));
}

/**
 * Change what skill is in what slot for the player.
 *
 */
export function setSkillInSlot(ctx: StateContext<IGameCombat>, { skill, slot }: SetSkill) {
  ctx.setState(patch<IGameCombat>({
    activeSkills: updateItem<string>(slot, skill)
  }));
}

/**
 * Add a combat log message to the log - a max of 10 can be shown at once.
 */
export function addCombatLogMessage(ctx: StateContext<IGameCombat>, { message }: AddCombatLogMessage) {

  const messages = ctx.getState().currentEncounter?.log ?? [];

  messages.push(message);

  while(messages.length > 10) {
    messages.shift();
  }

  ctx.setState(patch<IGameCombat>({
    currentEncounter: patch<IGameEncounter>({
      log: messages
    })
  }));
}

/**
 * Set whether or not combat is currently locked for the player (e.g. it is not their turn).
 */
export function setCombatLock(ctx: StateContext<IGameCombat>, { isLocked }: SetCombatLock) {
  ctx.setState(patch<IGameCombat>({
    currentEncounter: patch<IGameEncounter>({
      isLocked
    })
  }));
}

/**
 * Set whether or not combat is currently locked for the enemies (e.g. they can no longer attack).
 */
export function setCombatLockForEnemies(ctx: StateContext<IGameCombat>, { isLockedForEnemies }: SetCombatLockForEnemies) {
  ctx.setState(patch<IGameCombat>({
    currentEncounter: patch<IGameEncounter>({
      isLockedForEnemies
    })
  }));
}

/**
 * Set an enemy skill to be on cooldown.
 */
export function setEnemySkillOnCooldown(ctx: StateContext<IGameCombat>, { enemyIndex, slot, duration }: EnemyCooldownSkill) {
  const currentEncounter = ctx.getState().currentEncounter;
  if(!currentEncounter) {
    return;
  }

  currentEncounter.enemies[enemyIndex].cooldowns[slot] = duration;
}

/**
 * Set a player skill to be on cooldown.
 */
export function setPlayerSkillOnCooldown(ctx: StateContext<IGameCombat>, { slot, duration }: PlayerCooldownSkill) {
  const currentPlayer = ctx.getState().currentPlayer;
  if(!currentPlayer) {
    return;
  }

  currentPlayer.cooldowns[slot] = duration;
}

/**
 * Lower all cooldowns for a character.
 */
export function lowerCooldownForOneCharacter(character: IGameEncounterCharacter): IGameEncounterCharacter {
  const cooldowns = character.cooldowns;
  Object.keys(cooldowns).forEach(cd => {
    cooldowns[+cd] = cooldowns[+cd] - 1;

    if(cooldowns[+cd] <= 0) {
      delete cooldowns[+cd];
    }
  });

  return character;
}

/**
 * Reset the speed for the player.
 */
export function resetPlayerSpeed(ctx: StateContext<IGameCombat>) {
  const currentPlayer = ctx.getState().currentPlayer;
  if(!currentPlayer) {
    return;
  }

  ctx.setState(patch<IGameCombat>({
    currentPlayer: patch<IGameEncounterCharacter>({
      currentSpeed: currentPlayer.stats[Stat.Speed]
    })
  }));
}

/**
 * Reset the speed for an enemy.
 */
export function resetEnemySpeed(ctx: StateContext<IGameCombat>, { enemyIndex }: EnemySpeedReset) {
  const currentEncounter = ctx.getState().currentEncounter;
  if(!currentEncounter) {
    return;
  }

  const enemy = currentEncounter.enemies[enemyIndex];
  ctx.setState(patch<IGameCombat>({
    currentEncounter: patch<IGameEncounter>({
      enemies: updateItem<IGameEncounterCharacter>(enemyIndex, patch<IGameEncounterCharacter>({
        currentSpeed: enemy.stats[Stat.Speed]
      }))
    })
  }));
}

/**
 * Lower all of the player cooldowns.
 */
export function lowerPlayerCooldowns(ctx: StateContext<IGameCombat>) {
  const state = ctx.getState();

  if(!state.currentPlayer) {
    return;
  }

  ctx.setState(patch<IGameCombat>({
    currentPlayer: lowerCooldownForOneCharacter(state.currentPlayer)
  }));
}

/**
 * Lower all of the enemy cooldowns.
 */
export function lowerEnemyCooldowns(ctx: StateContext<IGameCombat>, { enemyIndex }: LowerEnemyCooldown) {
  const state = ctx.getState();

  if(!state.currentEncounter) {
    return;
  }

  const enemy = state.currentEncounter.enemies[enemyIndex];

  ctx.setState(patch<IGameCombat>({
    currentEncounter: patch<IGameEncounter>({
      enemies: updateItem<IGameEncounterCharacter>(enemyIndex, lowerCooldownForOneCharacter(enemy))
    })
  }));
}

export function acquireItemDrops(ctx: StateContext<IGameCombat>, enemy: IGameEncounterCharacter) {
  enemy.drops.forEach(drop => {
    const { item, resource, amount } = drop;

    if(resource) {
      ctx.dispatch([
        new AddCombatLogMessage(`You got ${amount}x ${resource}!`),
        new GainJobResult(resource, amount)
      ]);
    }

    if(item) {
      ctx.dispatch([
        new AddCombatLogMessage(`You got ${amount}x ${item}!`),
        ...Array(amount).fill(undefined).map(() => new GainJobResult(item, amount))
      ]);
    }
  });
}

/**
 * The player targets an enemy with an ability.
 */
export function targetEnemyWithAbility(
  ctx: StateContext<IGameCombat>,
  { targetIndex, source, ability, abilitySlot }: TargetEnemyWithAbility
) {

  const abilityFunc = getCombatFunction(ability.effect);
  if(!abilityFunc) {
    ctx.dispatch(new AddCombatLogMessage(`Ability ${ability.effect} is not implemented yet!`));
    return;
  }

  const encounter = ctx.getState().currentEncounter;
  if(!encounter) {
    return;
  }

  const player = ctx.getState().currentPlayer;
  if(!player) {
    return;
  }

  // lower all other cooldowns by 1 first
  ctx.dispatch(new LowerPlayerCooldown());

  const target = encounter.enemies[targetIndex];

  const deltas = abilityFunc(ctx, { ability, source, target });
  deltas.push({ target: 'source', attribute: 'currentEnergy', delta: -ability.energyCost });
  applyDeltas(ctx, source, target, deltas);

  if(isDead(target)) {
    ctx.dispatch(new AddCombatLogMessage(`${target.name} has been slain!`));
    acquireItemDrops(ctx, target);
  }

  ctx.dispatch(new PlayerCooldownSkill(abilitySlot, ability.cooldown));

  if(hasAnyoneWonCombat(ctx)) {
    handleCombatEnd(ctx);
    return;
  }

  ctx.dispatch([
    new PlayerSpeedReset(),
    new SetCombatLock(true)
  ]);
}

/**
 * The player targets themself with an ability.
 */
export function targetSelfWithAbility(ctx: StateContext<IGameCombat>, { ability, abilitySlot }: TargetSelfWithAbility) {

  const abilityFunc = getCombatFunction(ability.effect);
  if(!abilityFunc) {
    ctx.dispatch(new AddCombatLogMessage(`Ability ${ability.effect} is not implemented yet!`));
    return;
  }

  const currentPlayer = ctx.getState().currentPlayer;
  if(!currentPlayer) {
    return;
  }

  // lower all other cooldowns by 1 first
  ctx.dispatch(new LowerPlayerCooldown());

  const deltas = abilityFunc(ctx, { ability, source: currentPlayer, target: currentPlayer });
  deltas.push({ target: 'source', attribute: 'currentEnergy', delta: -ability.energyCost });
  applyDeltas(ctx, currentPlayer, currentPlayer, deltas);

  ctx.dispatch(new PlayerCooldownSkill(abilitySlot, ability.cooldown));

  if(hasAnyoneWonCombat(ctx)) {
    handleCombatEnd(ctx);
    return;
  }

  ctx.dispatch([
    new PlayerSpeedReset(),
    new SetCombatLock(true)
  ]);
}
