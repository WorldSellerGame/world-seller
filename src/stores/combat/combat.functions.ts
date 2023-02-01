import { StateContext } from '@ngxs/store';

import { patch, updateItem } from '@ngxs/store/operators';
import { IGameCombat, IGameEncounter, IGameEncounterCharacter, IGameItem, Stat } from '../../interfaces';
import {
  AddCombatLogMessage, EnemyCooldownSkill, EnemySpeedReset,
  LowerEnemyCooldown, PlayerCooldownSkill, SetCombatLock,
  SetCombatLockForEnemies,
  SetItem,
  SetSkill, TickEnemyEffects, UseItemInSlot
} from './combat.actions';

import { applyDeltas, handleCombatEnd, hasAnyoneWonCombat, isDead } from '../../app/helpers';
import { AddItemToInventory, GainJobResult, RemoveItemFromInventory } from '../charselect/charselect.actions';


export const defaultCombat: () => IGameCombat = () => ({
  version: 0,
  level: 0,
  activeSkills: [],
  activeItems: [],
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
 * Use the item in a slot, decrement its uses, and remove it if it's out of uses.
 */
export function useItemInSlot(ctx: StateContext<IGameCombat>, { slot }: UseItemInSlot) {
  const state = ctx.getState();

  const itemRef = state.activeItems[slot];
  if(!itemRef) {
    return;
  }

  const newDurability = itemRef.durability - 1;
  if(newDurability <= 0) {
    ctx.setState(patch<IGameCombat>({
      activeItems: updateItem<IGameItem | undefined>(slot, undefined)
    }));

    return;
  }

  ctx.setState(patch<IGameCombat>({
    activeItems: updateItem<IGameItem | undefined>(slot, patch<IGameItem | undefined>({
      durability: newDurability
    }))
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
 * Change what item is in what slot for the player.
 *
 */
export function setItemInSlot(ctx: StateContext<IGameCombat>, { item, slot }: SetItem) {

  const currentItem = ctx.getState().activeItems[slot];
  if(currentItem) {
    ctx.dispatch(new AddItemToInventory(currentItem));
  }

  ctx.setState(patch<IGameCombat>({
    activeItems: updateItem<IGameItem | undefined>(slot, item)
  }));

  if(item) {
    ctx.dispatch(new RemoveItemFromInventory(item));
  }
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

/**
 * Get all item drops (items and resources) from a singular enemy.
 */
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
 * Tick all of the player effects down by 1.
 */
export function tickPlayerEffects(ctx: StateContext<IGameCombat>) {
  const currentPlayer = ctx.getState().currentPlayer;
  if(!currentPlayer) {
    return;
  }

  if(isDead(currentPlayer)) {
    return;
  }

  const allEffects = currentPlayer.statusEffects;
  allEffects.forEach(effect => {
    effect.turnsLeft--;

    if(effect.damageOverTime) {
      const term = effect.damageOverTime > 0 ? 'damage' : 'healing';

      applyDeltas(ctx, currentPlayer, currentPlayer, [
        { target: 'source', attribute: 'currentHealth', delta: -effect.damageOverTime }
      ]);

      ctx.dispatch(
        new AddCombatLogMessage(`${currentPlayer.name} received ${Math.abs(effect.damageOverTime)} ${term} from ${effect.name}!`)
      );

      if(hasAnyoneWonCombat(ctx)) {
        handleCombatEnd(ctx);
        return;
      }
    }

    if(effect.turnsLeft <= 0) {

      applyDeltas(ctx, currentPlayer, currentPlayer, [
        { target: 'source', attribute: '', delta: 0, unapplyStatusEffect: effect }
      ]);

      ctx.dispatch(new AddCombatLogMessage(`${currentPlayer.name} no longer has the "${effect.name}" effect!`));
    }
  });


  const updatedEffects = allEffects.filter(effect => effect.turnsLeft > 0);
  ctx.setState(patch<IGameCombat>({
    currentPlayer: patch<IGameEncounterCharacter>({
      statusEffects: updatedEffects
    })
  }));
}

/**
 * Tick all of the enemy effects down by 1.
 */
export function tickEnemyEffects(ctx: StateContext<IGameCombat>, { enemyIndex }: TickEnemyEffects) {
  const currentEncounter = ctx.getState().currentEncounter;
  if(!currentEncounter) {
    return;
  }

  const enemy = currentEncounter.enemies[enemyIndex];

  if(isDead(enemy)) {
    return;
  }

  const allEffects = enemy.statusEffects;
  allEffects.forEach(effect => {
    effect.turnsLeft--;

    if(effect.damageOverTime) {
      const term = effect.damageOverTime > 0 ? 'damage' : 'healing';

      applyDeltas(ctx, enemy, enemy, [
        { target: 'source', attribute: 'currentHealth', delta: -effect.damageOverTime }
      ]);

      ctx.dispatch(new AddCombatLogMessage(`${enemy.name} received ${Math.abs(effect.damageOverTime)} ${term} from ${effect.name}!`));

      if(hasAnyoneWonCombat(ctx)) {
        handleCombatEnd(ctx);
        return;
      }
    }

    if(effect.turnsLeft <= 0) {

      applyDeltas(ctx, enemy, enemy, [
        { target: 'source', attribute: '', delta: 0, unapplyStatusEffect: effect }
      ]);

      ctx.dispatch(new AddCombatLogMessage(`${enemy.name} no longer has the "${effect.name}" effect!`));
    }
  });

  const updatedEffects = allEffects.filter(effect => effect.turnsLeft > 0);
  ctx.setState(patch<IGameCombat>({
    currentEncounter: patch<IGameEncounter>({
      enemies: updateItem<IGameEncounterCharacter>(enemyIndex, patch<IGameEncounterCharacter>({
        statusEffects: updatedEffects
      }))
    })
  }));
}
