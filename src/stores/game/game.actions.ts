import { IStatGains } from '../../interfaces';

export class TickTimer {
  static type = '[Game] Tick Timer';
  constructor(public ticks = 1) {}
}

export class PlaySFX {
  static type = '[Game] Play SFX';
  constructor(public sfx: string) {}
}

export class SetStatGains {
  static type = '[Game] Set Stat Gains';
  constructor(public statGains: IStatGains) {}
}

export class UpdateAllItems {
  static type = '[Game] Update All Items';
  constructor() {}
}

export class NotifyError {
  static type = '[Game] Notify Error';
  constructor(public message: string) {}
}

export class NotifyWarning {
  static type = '[Game] Notify Warning';
  constructor(public message: string) {}
}

export class NotifyInfo {
  static type = '[Game] Notify Info';
  constructor(public message: string) {}
}

export class NotifySuccess {
  static type = '[Game] Notify Success';
  constructor(public message: string) {}
}
