import { StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { sample, sampleSize } from 'lodash';
import { findUniqueTileInDungeonFloor } from '../../app/helpers';
import {
  DungeonNode, DungeonTile, IDungeon, IDungeonFloor,
  IGameCombat, IGameDungeonState, IGameEncounterCharacter
} from '../../interfaces';
import { GainJobResult } from '../charselect/charselect.actions';
import { NotifyInfo } from '../game/game.actions';
import { InitiateCombat } from './combat.actions';
import { acquireItemDrops } from './combat.functions';
import {
  EmptyDungeonTile, FullyHeal, GainPercentageOfDungeonLoot,
  LeaveDungeon, MoveInDungeon, MoveInDungeonByDelta
} from './dungeon.actions';

export function fullyHeal(ctx: StateContext<IGameCombat>) {
  const state = ctx.getState();
  if(!state.currentDungeon) {
    return;
  }

  ctx.setState(patch<IGameCombat>({
    currentPlayer: patch<IGameEncounterCharacter>({
      currentHealth: state.currentPlayer?.maxHealth,
      currentEnergy: state.currentPlayer?.maxEnergy
    })
  }));
}

export function leaveDungeon(ctx: StateContext<IGameCombat>) {
  ctx.setState(patch<IGameCombat>({
    currentDungeon: undefined
  }));
}

export function emptyDungeonTile(ctx: StateContext<IGameCombat>, { x, y, z }: EmptyDungeonTile) {
  const state = ctx.getState();
  if(!state.currentDungeon) {
    return;
  }

  ctx.setState(patch<IGameCombat>({
    currentDungeon: patch<IGameDungeonState>({
      dungeon: patch<IDungeon>({
        floors: updateItem<IDungeonFloor>(z, patch<IDungeonFloor>({
          layout: updateItem<DungeonNode[]>(y, updateItem<DungeonNode>(x, DungeonTile.Floor))
        }))
      })
    })
  }));
}

export function moveInDungeonByDelta(ctx: StateContext<IGameCombat>, { x, y }: MoveInDungeonByDelta) {
  const state = ctx.getState();
  if(!state.currentDungeon) {
    return;
  }

  const currentPos = state.currentDungeon.pos;
  ctx.dispatch(new MoveInDungeon(currentPos.x + x, currentPos.y + y, currentPos.z));
}

export function moveInDungeon(ctx: StateContext<IGameCombat>, { x, y, z, ignoreTile }: MoveInDungeon) {

  const state = ctx.getState();
  if(!state.currentDungeon) {
    return;
  }

  const dungeon = state.currentDungeon.dungeon;

  const tile = dungeon.floors[z].layout[y][x];
  if(tile === DungeonTile.Wall) {
    return;
  }

  // do the movement
  ctx.setState(patch<IGameCombat>({
    currentDungeon: patch<IGameDungeonState>({
      pos: {
        x,
        y,
        z
      }
    })
  }));

  if(!ignoreTile) {

    if(dungeon.treasureChests[tile]) {
      const chestData = sample(dungeon.treasureChests[tile]);
      acquireItemDrops(ctx, chestData?.drops || []);

      ctx.dispatch([
        new EmptyDungeonTile(x, y, z)
      ]);
      return;
    }

    if(dungeon.threats[tile]) {
      ctx.dispatch([
        new EmptyDungeonTile(x, y, z),
        new InitiateCombat(dungeon.threats[tile], false, false)
      ]);
      return;
    }

    switch(tile) {
      case DungeonTile.Entrance: {
        if(z === 0) {
          ctx.dispatch([
            new NotifyInfo('You left the dungeon.'),
            new GainPercentageOfDungeonLoot(100),
            new LeaveDungeon()
          ]);
          return;
        }

        const newLoc = findUniqueTileInDungeonFloor(state.currentDungeon.dungeon, z - 1, DungeonTile.Exit);
        if(newLoc) {
          ctx.dispatch(new MoveInDungeon(newLoc.x, newLoc.y, z - 1, true));
        }
        return;
      }

      case DungeonTile.Exit: {
        const newLoc = findUniqueTileInDungeonFloor(state.currentDungeon.dungeon, z + 1, DungeonTile.Entrance);
        if(newLoc) {
          ctx.dispatch(new MoveInDungeon(newLoc.x, newLoc.y, z + 1, true));
        }
        return;
      }

      case DungeonTile.Fire: {
        ctx.dispatch([
          new NotifyInfo('You took a rest at the campfire.'),
          new EmptyDungeonTile(x, y, z),
          new FullyHeal()
        ]);
        return;
      }

      case DungeonTile.Boss: {
        ctx.dispatch([
          new EmptyDungeonTile(x, y, z),
          new InitiateCombat(dungeon.boss, true, true)
        ]);
        return;
      }
    }
  }
}

export function gainPercentageOfDungeonLoot(ctx: StateContext<IGameCombat>, { percent }: GainPercentageOfDungeonLoot) {
  const state = ctx.getState();

  if(!state.currentDungeon) {
    console.log('no danga???');
    return;
  }

  const loot = state.currentDungeon.currentLoot;

  const actions: any[] = [];

  Object.keys(loot.resources).forEach(resource => {
    actions.push(new GainJobResult(resource, Math.floor(loot.resources[resource] * percent)));
  });

  if(loot.items.length > 0) {
    const numItems = Math.max(1, Math.floor(loot.items.length * percent));

    const chosenItems = sampleSize(loot.items, numItems);
    chosenItems.forEach(item => {
      actions.push(new GainJobResult(item, 1));
    });
  }

  ctx.dispatch(actions);

}
