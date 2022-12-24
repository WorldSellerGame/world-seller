import { IGameGatherLocation } from '../../interfaces';

export class SetFishingLocation {
  static type = '[Fishing] Set Fishing Location';
  constructor(public location: IGameGatherLocation) {}
}

export class CancelFishing {
  static type = '[Fishing] Cancel Fishing';
  constructor() {}
}
