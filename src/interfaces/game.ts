
export enum Rarity {
  Junk = 'Junk',
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary'
}

export interface IGame {
  version: number;
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
