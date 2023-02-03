
export class TickTimer {
  static type = '[Game] Tick Timer';
  constructor(public ticks = 1) {}
}

export class UpdateAllItems {
  static type = '[Game] Update All Items';
  constructor() {}
}
