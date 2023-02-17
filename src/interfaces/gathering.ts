import { IWeighted } from './game';


export interface IGameGatherLocation {
  name: string;
  description: string;
  perGather: { min: number; max: number };
  level: { min: number; max: number };
  gatherTime: number;
  cooldownTime?: number;
  resources: IWeighted[];
  maxWorkers: number;
}

export interface IGameGathering {
  version: number;
  unlocked: boolean;
  level: number;
  currentLocation?: IGameGatherLocation;
  currentLocationDurationInitial: number;
  currentLocationDuration: number;
  cooldowns: Record<string, number>;
}
