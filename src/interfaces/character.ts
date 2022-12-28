import { IGameItem, ItemType } from './game';

export interface ICharacter {
  name: string;
  lastSavedAt: number;
  lastTotalLevel: number;
  resources: Record<string, number>;
  inventory: IGameItem[];
  equipment: Partial<Record<ItemType, IGameItem>>;
}
