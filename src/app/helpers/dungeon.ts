import { StateContext } from '@ngxs/store';
import { DungeonTile, IDungeon, IGameCombat } from '../../interfaces';

export function findUniqueTileInDungeonFloor(dungeon: IDungeon, floor: number, tile: DungeonTile): { x: number; y: number } | undefined {
  if(floor < 0) {
    return undefined;
  }

  const layout = dungeon.floors[floor].layout;
  for(let y = 0; y < layout.length; y++) {
    for(let x = 0; x < layout[y].length; x++) {
      if(layout[y][x] === tile) {
        return { x, y };
      }
    }
  }

  return undefined;
}

export function canMoveTo(ctx: StateContext<IGameCombat>, { x, y }: { x: number; y: number }): boolean {
  const state = ctx.getState();

  const { currentDungeon } = state;
  if(!currentDungeon) {
    return false;
  }

  const currentPos = currentDungeon.pos;
  const layout = currentDungeon.dungeon.floors[currentPos.z].layout;

  return layout[y][x] !== DungeonTile.Wall;
}
