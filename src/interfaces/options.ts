
export enum GameOption {
  DebugMode = 'debugMode',
  ShrinkSidebar = 'shrinkSidebar',
}

export interface IOptions {
  version: number;
  [GameOption.DebugMode]: boolean;
  [GameOption.ShrinkSidebar]: boolean;
}
