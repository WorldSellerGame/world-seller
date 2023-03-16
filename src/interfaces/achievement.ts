
export enum AchievementStat {
  Kills = 'kills',
  Deaths = 'deaths',
  Damage = 'damage',
  Healing = 'healing',

  ResourcesGained = 'resourcesGained',
  ItemsGained = 'itemsGained',

  GatherFishing = 'gatherFishing',
  GatherForaging = 'gatherForaging',
  GatherHunting = 'gatherHunting',
  GatherLogging = 'gatherLogging',
  GatherMining = 'gatherMining',

  RefineAlchemy = 'refineAlchemy',
  RefineBlacksmithing = 'refineBlacksmithing',
  RefineCooking = 'refineCooking',
  RefineJewelcrafting = 'refineJewelcrafting',
  RefineWeaving = 'refineWeaving',

  FarmingHarvest = 'farmingHarvest',

  CombatThreatsEngaged = 'combatThreatsEngaged',
  CombatThreatsBeaten = 'combatThreatsBeaten',
  CombatDungeonsEntered = 'combatDungeonsEntered',
  CombatDungeonsWon = 'combatDungeonsWon',

  MercantileBuyWorkers = 'mercantileBuyWorkers',
  MercantileSellItems = 'mercantileSellItems',
  MercantileExchangeSwap = 'mercantileExchangeSwap',
  MercantileExchangeBuy = 'mercantileExchangeBuy',

  ProspectingProspects = 'prospectingProspects',
}

// one time stats like Dungeon10, Dungeon20, etc aren't going to be tracked here

export interface IGameAchievements {
  version: number;
  stats: Partial<Record<AchievementStat | string, number>>;
  achievements: Record<string, boolean>;
}

export interface IAchievement {
  name: string;
  description: string;
  icon: string;

  stat: AchievementStat;
  requiredValue: number;
  isHidden?: boolean;
}
