import { StateContext } from '@ngxs/store';

import { append, patch, updateItem } from '@ngxs/store/operators';
import {
  IGameCombat, IGameDungeonLoot, IGameDungeonState,
  IGameEncounter, IGameEncounterCharacter, IGameEncounterDrop, IGameItem, Stat
} from '../../interfaces';
import {
  AddCombatLogMessage, ConsumeFoodCharges, DebugApplyEffectToPlayer,
  DebugSetPlayerEnergy, DebugSetPlayerHealth, EnemyCooldownSkill, EnemySpeedReset,
  GainCombatLevels,
  LowerEnemyCooldown, OOCEatFood, OOCEatFoodInDungeon, OOCPlayerEnergy, OOCPlayerHeal, PlayerCooldownSkill, SetCombatLock,
  SetCombatLockForEnemies,
  SetFood,
  SetItem,
  SetSkill, TickEnemyEffects, UseItemInSlot
} from './combat.actions';

import { clamp } from 'lodash';
import { applyDeltas, getStat, handleCombatEnd, hasAnyoneWonCombat, isDead } from '../../app/helpers';
import { AddItemToInventory, GainItemOrResource, RemoveItemFromInventory } from '../charselect/charselect.actions';
import { NotifyInfo } from '../game/game.actions';


export const defaultCombat: () => IGameCombat = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  activeSkills: [],
  activeItems: [],
  activeFoods: [],
  currentDungeon: undefined,
  currentEncounter: undefined,
  currentPlayer: undefined,
  threatChangeTicks: 3600,
  threats: [],
  oocEnergyTicks: 10,
  oocHealTicks: 10
});

export function unlockCombat(ctx: StateContext<IGameCombat>) {
  ctx.patchState({ unlocked: true });
}

export function gainCombatLevels(ctx: StateContext<IGameCombat>, { levels }: GainCombatLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetCombat(ctx: StateContext<IGameCombat>) {
  ctx.setState(defaultCombat());
}

/**
 * Prepare combat for closing in 3 seconds.
 */
export function prepareCombatForRestart(ctx: StateContext<IGameCombat>) {
  ctx.setState(patch<IGameCombat>({
    currentEncounter: patch<IGameEncounter>({
      resetInSeconds: 3
    })
  }));
}

/**
 * Fully heal combat participants, don't reset anything else.
 */
export function resetCombatSoft(ctx: StateContext<IGameCombat>) {
  const state = ctx.getState();

  if(!state.currentPlayer || !state.currentEncounter) {
    return;
  }

  ctx.setState(patch<IGameCombat>({
    currentPlayer: patch<IGameEncounterCharacter>({
      currentHealth: state.currentPlayer.maxHealth,
      currentEnergy: state.currentPlayer.maxEnergy
    }),
    currentEncounter: patch<IGameEncounter>({
      enemies: state.currentEncounter.enemies.map(enemy => ({
        ...enemy,
        currentHealth: enemy.maxHealth,
        currentEnergy: enemy.maxEnergy
      }))
    })
  }));

}

/**
 * End the current combat but do not reset the player stats (in case of subsequent fights).
 *
 */
export function endCombat(ctx: StateContext<IGameCombat>) {

  // lower all foods by 1
  ctx.dispatch(new ConsumeFoodCharges());

  ctx.setState(patch<IGameCombat>({
    currentEncounter: undefined
  }));
}

/**
 * End the combat and reset the player (for one-off battles).
 */
export function endCombatAndResetPlayer(ctx: StateContext<IGameCombat>) {

  // lower all foods by 1
  ctx.dispatch(new ConsumeFoodCharges());

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

  if(itemRef.durability === -1) {
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
      durability: newDurability,
      foodDuration: newDurability
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
 * Change what food is in what slot for the player.
 *
 */
export function setFoodInSlot(ctx: StateContext<IGameCombat>, { item, slot }: SetFood) {

  const currentItem = ctx.getState().activeFoods[slot];
  if(currentItem) {
    ctx.dispatch(new AddItemToInventory(currentItem));
  }

  ctx.setState(patch<IGameCombat>({
    activeFoods: updateItem<IGameItem | undefined>(slot, item)
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
 * Set whether or not combat is currently done (so things can't continue).
 */
export function setCombatDone(ctx: StateContext<IGameCombat>) {
  ctx.setState(patch<IGameCombat>({
    currentEncounter: patch<IGameEncounter>({
      isDone: true
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
      currentSpeed: getStat(currentPlayer.stats, Stat.Speed)
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
        currentSpeed: getStat(enemy.stats, Stat.Speed)
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
export function acquireItemDrops(ctx: StateContext<IGameCombat>, drops: IGameEncounterDrop[]) {

  const isInDungeon = !!ctx.getState().currentDungeon;

  drops.forEach(drop => {
    const { item, resource, amount } = drop;

    if(resource) {

      // in a dungeon, we store the loot
      if(isInDungeon) {
        const currentResourceValue = ctx.getState().currentDungeon?.currentLoot?.resources[resource] ?? 0;

        ctx.dispatch(new NotifyInfo(`You found ${amount}x ${resource}!`));

        ctx.setState(patch<IGameCombat>({
          currentDungeon: patch<IGameDungeonState>({
            currentLoot: patch<IGameDungeonLoot>({
              resources: patch<Record<string, number>>({
                [resource]: currentResourceValue + amount
              })
            })
          })
        }));

        return;
      }

      ctx.dispatch([
        new AddCombatLogMessage(`You got ${amount}x ${resource}!`),
        new GainItemOrResource(resource, amount)
      ]);
    }

    if(item) {

      // in a dungeon, we store the loot
      if(isInDungeon) {

        ctx.dispatch(new NotifyInfo(`You found ${amount}x ${item}!`));

        ctx.setState(patch<IGameCombat>({
          currentDungeon: patch<IGameDungeonState>({
            currentLoot: patch<IGameDungeonLoot>({
              items: append<string>(Array(amount).fill(undefined).map(() => item))
            })
          })
        }));

        return;
      }

      ctx.dispatch([
        new AddCombatLogMessage(`You got ${amount}x ${item}!`),
        ...Array(amount).fill(undefined).map(() => new GainItemOrResource(item, amount))
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

  if(isDead(currentPlayer) || hasAnyoneWonCombat(ctx)) {
    return;
  }

  let shouldProcessMore = true;

  const allEffects = currentPlayer.statusEffects;
  allEffects.forEach(effect => {
    if(!shouldProcessMore) {
      return;
    }
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
        shouldProcessMore = false;
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
 * Unapply all player status effects (when they die).
 */
export function unapplyAllEffectsForPlayer(ctx: StateContext<IGameCombat>) {
  const currentPlayer = ctx.getState().currentPlayer;
  if(!currentPlayer) {
    return;
  }

  applyDeltas(ctx, currentPlayer, currentPlayer,
    currentPlayer.statusEffects.map(effect => ({ target: 'source', attribute: '', delta: 0, unapplyStatusEffect: effect })));
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

/**
 * Consume one charge of food per food item.
 */
export function consumeFoodCharges(ctx: StateContext<IGameCombat>) {
  const state = ctx.getState();

  const foods = state.activeFoods.map(food => {
    if(!food) {
      return undefined;
    }

    const newDuration = (food.foodDuration ?? 0) - 1;

    if(newDuration <= 0) {
      ctx.dispatch(new NotifyInfo(`Your ${food.name} effects have worn off.`));
      return undefined;
    }

    return { ...food, foodDuration: newDuration, durability: newDuration };
  });

  ctx.setState(patch<IGameCombat>({ activeFoods: foods }));
}

/**
 * Apply an effect to the player (debug only).
 */
export function applyEffectToPlayer(ctx: StateContext<IGameCombat>, { effect }: DebugApplyEffectToPlayer) {
  const player = ctx.getState().currentPlayer;
  if(!player) {
    return;
  }

  applyDeltas(ctx, player, player, [
    { target: 'source', attribute: '', delta: 0, applyStatusEffect: effect }
  ]);
}

/**
 * Set the players health in combat (debug only).
 */
export function debugSetCombatHealth(ctx: StateContext<IGameCombat>, { value }: DebugSetPlayerHealth) {
  const player = ctx.getState().currentPlayer;
  if(!player) {
    return;
  }

  ctx.setState(patch<IGameCombat>({
    currentPlayer: patch<IGameEncounterCharacter>({
      currentHealth: value
    })
  }));
}

/**
 * Set the players energy in combat (debug only).
 */
export function debugSetCombatEnergy(ctx: StateContext<IGameCombat>, { value }: DebugSetPlayerEnergy) {
  const player = ctx.getState().currentPlayer;
  if(!player) {
    return;
  }

  ctx.setState(patch<IGameCombat>({
    currentPlayer: patch<IGameEncounterCharacter>({
      currentEnergy: value
    })
  }));
}

/**
 * Heal out of combat (usually by eating food, but sometimes natural regen).
 */
export function oocPlayerHeal(ctx: StateContext<IGameCombat>, { amount }: OOCPlayerHeal) {
  const state = ctx.getState();
  if(!state.currentPlayer || state.currentEncounter) {
    return;
  }

  ctx.setState(patch<IGameCombat>({
    currentPlayer: patch<IGameEncounterCharacter>({
      currentHealth: clamp(state.currentPlayer.maxHealth, 0, state.currentPlayer.currentHealth + amount)
    })
  }));
}

/**
 * Restore energy out of combat (usually by eating food, but sometimes natural regen).
 */
export function oocPlayerEnergy(ctx: StateContext<IGameCombat>, { amount }: OOCPlayerEnergy) {
  const state = ctx.getState();
  if(!state.currentPlayer || state.currentEncounter) {
    return;
  }

  ctx.setState(patch<IGameCombat>({
    currentPlayer: patch<IGameEncounterCharacter>({
      currentEnergy: clamp(state.currentPlayer.maxEnergy, 0, state.currentPlayer.currentEnergy + amount)
    })
  }));
}

/**
 * Eat food out of combat, to heal, exclusively.
 */
export function oocEatFood(ctx: StateContext<IGameCombat>, { item }: OOCEatFood) {
  const state = ctx.getState();
  if(!state.currentPlayer || state.currentEncounter) {
    return;
  }

  const healing = item.oocHealth ?? 0;
  const energy = item.oocEnergy ?? 0;
  if(healing <= 0 && energy <= 0) {
    return;
  }

  ctx.dispatch([
    new RemoveItemFromInventory(item),
    new OOCPlayerHeal(healing),
    new OOCPlayerEnergy(energy),
    new NotifyInfo(`You healed ${healing} HP and ${energy} Energy!`)
  ]);
}

/**
 * Eat food out of combat (but in a dungeon), to heal, exclusively.
 */
export function oocEatFoodInDungeon(ctx: StateContext<IGameCombat>, { slot }: OOCEatFoodInDungeon) {
  const state = ctx.getState();
  if(!state.currentPlayer || state.currentEncounter) {
    return;
  }

  const item = state.activeItems[slot];
  if(!item) {
    return;
  }

  const healing = item.oocHealth ?? 0;
  const energy = item.oocEnergy ?? 0;
  if(healing <= 0 && energy <= 0) {
    return;
  }

  if(item.durability !== -1) {
    const newDurability = (item.durability ?? 0) - 1;
    if(newDurability <= 0) {
      ctx.dispatch([
        new NotifyInfo(`Your ${item.name} has been fully consumed.`),
        new SetItem(undefined, slot)
      ]);
    } else {
      ctx.setState(patch<IGameCombat>({
        activeItems: updateItem<IGameItem | undefined>(slot, patch<IGameItem | undefined>({
          durability: newDurability,
          foodDuration: newDurability
        }))
      }));
    }
  }

  ctx.dispatch([
    new OOCPlayerHeal(healing),
    new OOCPlayerEnergy(energy),
    new NotifyInfo(`You healed ${healing} HP and ${energy} Energy!`)
  ]);
}
