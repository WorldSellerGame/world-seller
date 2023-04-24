import { IGameEncounterDrop } from './combat';

/**
 * Dungeon floor layouts are a 2d array of strings and numbers. Some signifiers:
 *
 * - . is a wall
 * - 1 is a floor
 * - e is the entrance to your current floor
 * - x is the exit from your current floor
 * - b is the boss of the dungeon (beating the boss will let you leave, and give your skill point)
 *
 * Anything else is a threat or a chest. These can have any signifier, but the convention that I'm establishing is:
 *
 * - starting with a t = threat
 * - starting with a c = chest0
 */

export type DungeonNode = number|string|DungeonTile;

export enum DungeonTile {
  Wall = '.',
  Floor = 1,
  Fire = 'f',
  Entrance = 'e',
  Exit = 'x',
  Boss = 'b'
}

export interface IDungeonFloor {
  name: string;
  layout: DungeonNode[][];
}

export interface IDungeonChest {
  config: string;
  drops: IGameEncounterDrop[];
}

export interface IDungeon {
  name: string;
  description: string;
  icon: string;

  recommendedTotalLevel: number;
  givesPointAtCombatLevel: number;

  floors: IDungeonFloor[];

  boss: string;
  threats: Record<string, string>;
  treasureChests: Record<string, IDungeonChest[]>;
}
