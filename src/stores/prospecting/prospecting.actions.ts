import { IGameResourceTransform } from '../../interfaces';

export class ProspectRock {
  static type = '[Prospecting] Prospect Rock';
  constructor(public prospect: IGameResourceTransform, public quantity = 1) {}
}
