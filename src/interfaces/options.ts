
export enum GameOption {
  DebugMode = 'debugMode',
  ShrinkSidebar = 'shrinkSidebar',
  TickTimer = 'tickTimer',
}

export interface IOptions {
  version: number;
  [GameOption.DebugMode]: boolean;
  [GameOption.ShrinkSidebar]: boolean;
  [GameOption.TickTimer]: number;
}
