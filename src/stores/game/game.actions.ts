import { IStatGains, Tradeskill } from '../../interfaces';

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

export class NotifyTradeskill {
  static type = '[Game] Notify Tradeskill';
  constructor(public tradeskill: Tradeskill, public message: string) {}
}

export class AnalyticsTrack {
  static type = '[Game] Analytics Track';
  constructor(public event: string, public value = 1) {}
}

export class UpdateFirebaseUID {
  static type = '[Game] Update Firebase UID';
  constructor(public uid: string) {}
}

export class UpdateFirebaseSavefile {
  static type = '[Game] Update Firebase Savefile';
  constructor() {}
}
