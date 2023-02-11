
export class TickTimer {
  static type = '[Game] Tick Timer';
  constructor(public ticks = 1) {}
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
