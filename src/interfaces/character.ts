import { IGameItem, ItemType, Stat } from './game';

export interface ICharacter {
  name: string;
  equipment: Partial<Record<ItemType, IGameItem>>;
}

export interface IPlayerCharacter extends ICharacter {
  lastSavedAt: number;
  lastTotalLevel: number;
  resources: Record<string, number>;
  inventory: IGameItem[];
}

export interface IEnemyDrop {
  resource?: string;
  item?: string;

  min: number;
  max: number;
  chance: number;
}

export interface IEnemyCharacter extends ICharacter {
  icon: string;
  description: string;
  health: number;
  energy: number;

  idleChance: number;

  stats: Partial<Record<Stat, number>>;
  abilities: string[];

  drops: IEnemyDrop[];
}
