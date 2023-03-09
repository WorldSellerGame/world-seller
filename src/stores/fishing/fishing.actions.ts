import { IGameGatherLocation } from '../../interfaces';

export class UnlockFishing {
  static type = '[Fishing] Unlock';
}

export class GainFishingLevels {
  static type = '[Fishing] Gain Levels';
  constructor(public levels = 1) {}
}

export class SetFishingLocation {
  static type = '[Fishing] Set Fishing Location';
  constructor(public location: IGameGatherLocation) {}
}

export class CancelFishing {
  static type = '[Fishing] Cancel Fishing';
  constructor() {}
}
