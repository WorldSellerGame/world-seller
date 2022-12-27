
export enum GameOption {
  DebugMode = 'debugMode',
  SidebarDisplay = 'sidebarDisplay',
  //ShrinkSidebar = 'shrinkSidebar',
  TickTimer = 'tickTimer',
}

export interface IOptions {
  version: number;
  [GameOption.DebugMode]: boolean;
  [GameOption.SidebarDisplay]: string;
  //[GameOption.ShrinkSidebar]: boolean;
  [GameOption.TickTimer]: number;
}
