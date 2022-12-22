import { IGameGatherLocation } from '../../interfaces';

export class SetLoggingLocation {
  static type = '[Logging] Set Logging Location';
  constructor(public location: IGameGatherLocation) {}
}

export class CancelLogging {
  static type = '[Logging] Cancel Logging';
  constructor() {}
}
