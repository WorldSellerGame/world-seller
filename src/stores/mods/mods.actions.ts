import { IGameModStored } from '../../interfaces';

export class SetModioAuthToken {
  static type = '[Mods] Set Modio Auth Token';
  constructor(public token: string, public expiresAt: number) {}
}

export class CacheMod {
  static type = '[Mods] Cache Mod';
  constructor(public modId: number, public modData: IGameModStored) {}
}

export class UncacheMod {
  static type = '[Mods] Uncache Mod';
  constructor(public modId: number) {}
}
