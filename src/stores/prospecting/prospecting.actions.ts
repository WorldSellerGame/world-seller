import { IGameResourceTransform } from '../../interfaces';

export class UnlockProspecting {
  static type = '[Prospecting] Unlock';
}

export class ProspectRock {
  static type = '[Prospecting] Prospect Rock';
  constructor(public prospect: IGameResourceTransform, public quantity = 1) {}
}
