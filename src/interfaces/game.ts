
export interface IGame {
  version: number;
}

export interface IWeighted {
  name: string;
  weight: number;
}

export interface IGameMining {
  version: number;
  level: number;
  currentLocation?: IGameMiningLocation;
  currentLocationDurationInitial: number;
  currentLocationDuration: number;
}

export interface IGameMiningLocation {
  name: string;
  description: string;
  perGather: { min: number; max: number };
  level: { min: number; max: number };
  gatherTime: number;
  resources: IWeighted[];
}
