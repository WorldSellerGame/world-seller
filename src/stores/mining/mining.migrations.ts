import { IGameMining } from '../../interfaces';

export const miningStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameMining) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'mining' }));
