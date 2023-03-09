import { IGameGatherLocation } from '../../interfaces';

export class UnlockLogging {
  static type = '[Logging] Unlock';
}

export class GainLoggingLevels {
  static type = '[Logging] Gain Levels';
  constructor(public levels = 1) {}
}

export class SetLoggingLocation {
  static type = '[Logging] Set Logging Location';
  constructor(public location: IGameGatherLocation) {}
}

export class CancelLogging {
  static type = '[Logging] Cancel Logging';
  constructor() {}
}
