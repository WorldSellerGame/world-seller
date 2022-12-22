import { IGameGatherLocation } from '../../interfaces';

export class SetHuntingLocation {
  static type = '[Hunting] Set Hunting Location';
  constructor(public location: IGameGatherLocation) {}
}

export class CancelHunting {
  static type = '[Hunting] Cancel Hunting';
  constructor() {}
}
