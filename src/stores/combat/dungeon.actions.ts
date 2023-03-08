import { IDungeon } from '../../interfaces';


export class FullyHeal {
  static type = '[Dungeon] Fully Heal';
  constructor() {}
}

export class EnterDungeon {
  static type = '[Dungeon] Enter Dungeon';
  constructor(public dungeon: IDungeon) {}
}

export class LeaveDungeon {
  static type = '[Dungeon] Leave Dungeon';
  constructor() {}
}

export class EmptyDungeonTile {
  static type = '[Dungeon] Empty Dungeon Tile';
  constructor(public x: number, public y: number, public z: number) {}
}

export class MoveInDungeon {
  static type = '[Dungeon] Move In Dungeon';
  constructor(public x: number, public y: number, public z: number, public ignoreTile = false) {}
}

export class MoveInDungeonByDelta {
  static type = '[Dungeon] Move In Dungeon By Delta';
  constructor(public x: number, public y: number) {}
}

export class GainPercentageOfDungeonLoot {
  static type = '[Dungeon] Gain Percentage Of Dungeon Loot';
  constructor(public percent: number) {
    this.percent = Math.max(0, Math.min(1, percent / 100));
  }
}
