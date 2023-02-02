import { IGameCombatAbilityEffect } from './combat';

export enum Rarity {
  Broken = 'Broken',
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
  CraftingTables = 'Crafting Tables',
  Weapons = 'Weapons'
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
  Healing = 'healing',
  Attack = 'attack',
  EnergyBonus = 'energyBonus',
  HealthBonus = 'healthBonus',
  Speed = 'speed'
}

export enum ItemType {

  // tools
  Pickaxe = 'Pickaxe',
  Axe = 'Axe',
  FishingRod = 'FishingRod',
  FishingBait = 'FishingBait',
  Scythe = 'Scythe',
  HuntingTool = 'HuntingTool',
  Weapon = 'Weapon',

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

  // used to uniquely identify this item
  id?: string;

  // used to identify the item based on its internal name/id (for migrating items)
  internalId?: string;
  name: string;
  description: string;
  type: ItemType;
  category: ItemCategory;
  rarity: Rarity;
  durability: number;
  value: number;
  icon: string;
  canStack?: boolean;
  quantity?: number;
  givesAbility?: string;
  effects?: IGameCombatAbilityEffect[];
  stats: Record<Stat, number>;

  foodDuration?: number;
  sellTicks?: number;
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
