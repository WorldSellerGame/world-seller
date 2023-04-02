
export enum GameOption {
  DebugMode = 'debugMode',
  ColorTheme = 'colorTheme',
  SidebarDisplay = 'sidebarDisplay',
  TickTimer = 'tickTimer',
  SoundMaster = 'soundMaster',
  SoundSFX = 'soundSFX',
  TelemetryErrors = 'telemetryErrors',
  TelemetrySavefiles = 'telemetrySavefiles',
  NotificationCorner = 'notificationCorner',
  ShowNotifications = 'showNotifications',
}

export interface IOptions {
  version: number;
  [GameOption.DebugMode]: boolean;
  [GameOption.ColorTheme]: string;
  [GameOption.SidebarDisplay]: string;
  [GameOption.TickTimer]: number;
  [GameOption.SoundMaster]: number;
  [GameOption.SoundSFX]: number;
  [GameOption.TelemetryErrors]: boolean;
  [GameOption.TelemetrySavefiles]: boolean;
  [GameOption.NotificationCorner]: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  [GameOption.ShowNotifications]: boolean;
}
