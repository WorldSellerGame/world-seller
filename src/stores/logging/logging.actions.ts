import { IGameGatherLocation } from '../../interfaces';

export class UnlockLogging {
  static type = '[Logging] Unlock';
}

export class SetLoggingLocation {
  static type = '[Logging] Set Logging Location';
  constructor(public location: IGameGatherLocation) {}
}

export class CancelLogging {
  static type = '[Logging] Cancel Logging';
  constructor() {}
}
