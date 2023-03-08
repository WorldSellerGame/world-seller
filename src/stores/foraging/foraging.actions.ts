import { IGameGatherLocation } from '../../interfaces';

export class UnlockForaging {
  static type = '[Foraging] Unlock';
}

export class SetForagingLocation {
  static type = '[Foraging] Set Foraging Location';
  constructor(public location: IGameGatherLocation) {}
}

export class CancelForaging {
  static type = '[Foraging] Cancel Foraging';
  constructor() {}
}
