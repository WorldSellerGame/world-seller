import { IGame } from '../../interfaces';

export const gameStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGame) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'game' }));
