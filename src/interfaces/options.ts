
export enum GameOption {
  DebugMode = 'debugMode'
}

export interface IOptions {
  version: number;
  [GameOption.DebugMode]: boolean;
}
