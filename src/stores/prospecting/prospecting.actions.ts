import { IGameResourceTransform } from '../../interfaces';

export class UnlockProspecting {
  static type = '[Prospecting] Unlock';
}

export class GainProspectingLevels {
  static type = '[Prospecting] Gain Levels';
  constructor(public levels = 1) {}
}

export class ProspectRock {
  static type = '[Prospecting] Prospect Rock';
  constructor(public prospect: IGameResourceTransform, public quantity = 1) {}
}
