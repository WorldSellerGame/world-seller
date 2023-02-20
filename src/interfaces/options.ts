
export enum GameOption {
  DebugMode = 'debugMode',
  ColorTheme = 'colorTheme',
  SidebarDisplay = 'sidebarDisplay',
  TickTimer = 'tickTimer',
  TelemetryErrors = 'telemetryErrors',
  TelemetrySavefiles = 'telemetrySavefiles',
}

export interface IOptions {
  version: number;
  [GameOption.DebugMode]: boolean;
  [GameOption.ColorTheme]: string;
  [GameOption.SidebarDisplay]: string;
  [GameOption.TickTimer]: number;
  [GameOption.TelemetryErrors]: boolean;
  [GameOption.TelemetrySavefiles]: boolean;
}
