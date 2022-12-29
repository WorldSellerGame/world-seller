
export enum GameOption {
  DebugMode = 'debugMode',
  ColorTheme = 'colorTheme',
  SidebarDisplay = 'sidebarDisplay',
  TickTimer = 'tickTimer',
}

export interface IOptions {
  version: number;
  [GameOption.DebugMode]: boolean;
  [GameOption.ColorTheme]: string;
  [GameOption.SidebarDisplay]: string;
  [GameOption.TickTimer]: number;
}
