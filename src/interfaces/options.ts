
export enum GameOption {
  DebugMode = 'debugMode'
}

export interface IOptions {
  [GameOption.DebugMode]: boolean;
}
