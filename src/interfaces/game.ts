
export enum Rarity {
  Junk = 'Junk',
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary'
}

export enum Stat {

  // power reduces the time it takes to gather a resource by seconds
  PickaxePower = 'pickaxePower',
  AxePower = 'axePower',
  FishingPower = 'fishingPower',
  ScythePower = 'scythePower',
  HuntingPower = 'huntingPower',

  // speed reduces the cooldown time of a gather node by seconds
  PickaxeSpeed = 'pickaxeSpeed',
  AxeSpeed = 'axeSpeed',
  FishingSpeed = 'fishingSpeed',
  ScytheSpeed = 'scytheSpeed',
  HuntingSpeed = 'huntingSpeed',

  // generic stats
  Armor = 'armor'
}

export enum ItemType {

  // tools
  Pickaxe = 'Pickaxe',
  Axe = 'Axe',
  FishingRod = 'FishingRod',
  FishingBait = 'FishingBait',
  Scythe = 'Scythe',
  HuntingTool = 'HuntingTool',

  // armor
  LegArmor = 'LegArmor',
  ChestArmor = 'ChestArmor',
  HeadArmor = 'HeadArmor',
  FootArmor = 'FootArmor',
  HandArmor = 'HandArmor',
}

export interface IGame {
  version: number;
}

export interface IGameItem {
  name: string;
  description: string;
  type: ItemType;
  category: string;
  rarity: Rarity;
  durability: number;
  icon: string;
  canStack?: boolean;
  quantity?: number;
  stats: Record<Stat, number>;
}

export interface IGameRecipe {
  result: string;
  ingredients: Record<string, number>;
  level: { min: number; max: number };
  perCraft: { min: number; max: number };
  craftTime: number;
}

export interface IGameResource {
  description: string;
  icon: string;
  rarity: Rarity;
  category: string;
}

export interface IWeighted {
  name: string;
  weight: number;
}

export interface IGameGatherLocation {
  name: string;
  description: string;
  perGather: { min: number; max: number };
  level: { min: number; max: number };
  gatherTime: number;
  cooldownTime?: number;
  resources: IWeighted[];
}

export interface IGameGathering {
  version: number;
  level: number;
  currentLocation?: IGameGatherLocation;
  currentLocationDurationInitial: number;
  currentLocationDuration: number;
  cooldowns: Record<string, number>;
}

export interface IGameRefiningRecipe {
  recipe: IGameRecipe;
  totalDurationInitial: number;
  totalLeft: number;
  durationPer: number;
  currentDuration: number;
}

export interface IGameRefining {
  version: number;
  level: number;
  recipeQueue: IGameRefiningRecipe[];
}
