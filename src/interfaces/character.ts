import { IGameItem } from './game';

export enum ICharacterEquipmentSlot {
  Pickaxe = 'pickaxe',
  Axe = 'axe',
  FishingRod = 'fishingRod',
  FishingBait = 'fishingBait',
  Scythe = 'scythe',
  HuntingTool = 'huntingTool',
}

export interface ICharacter {
  name: string;
  lastSavedAt: number;
  lastTotalLevel: number;
  resources: Record<string, number>;
  inventory: IGameItem[];
  equipment: Partial<Record<ICharacterEquipmentSlot, IGameItem>>;
}
