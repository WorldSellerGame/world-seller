import { IGameGatherLocation } from '../../interfaces';

export class UnlockHunting {
  static type = '[Hunting] Unlock';
}

export class GainHuntingLevels {
  static type = '[Hunting] Gain Levels';
  constructor(public levels = 1) {}
}

export class SetHuntingLocation {
  static type = '[Hunting] Set Hunting Location';
  constructor(public location: IGameGatherLocation) {}
}

export class CancelHunting {
  static type = '[Hunting] Cancel Hunting';
  constructor() {}
}

export class StarHuntingLocation {
  static type = '[Hunting] Star Hunting Location';
  constructor(public location: IGameGatherLocation) {}
}

