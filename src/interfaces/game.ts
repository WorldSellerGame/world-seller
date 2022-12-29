
export enum Rarity {
  Junk = 'Junk',
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary'
}

export enum ItemCategory {
  Tools = 'Tools',
  Armor = 'Armor',
  Foods = 'Foods',
  Jewelry = 'Jewelry',
  Potions = 'Potions',
  Seeds = 'Seeds',
  Miscellaneous = 'Miscellaneous',
  RawMaterials = 'Raw Materials',
  RefinedMaterials = 'Refined Materials',
  CraftingTables = 'Crafting Tables'
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
  Armor = 'armor',
  Healing = 'healing'
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
  Jewelry = 'Jewelry',

  // usable
  Food = 'Food',
  Potion = 'Potion'
}

export interface IGame {
  version: number;
}

export interface IGameItem {
  name: string;
  description: string;
  type: ItemType;
  category: ItemCategory;
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
  preserve?: string[];
  require?: string[];
}

export interface IGameResourceTransform {
  startingItem: string;
  becomes: IWeighted[];
  perGather: { min: number; max: number };
  level: { min: number; max: number };
  gatherTime: number;
}

export interface IGameResource {
  description: string;
  icon: string;
  rarity: Rarity;
  category: ItemCategory;
}

export interface IWeighted {
  name: string;
  weight: number;
  quantity?: number;
}
