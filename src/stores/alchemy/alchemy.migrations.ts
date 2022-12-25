import { IGameRefining } from '../../interfaces';

export const alchemyStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameRefining) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'alchemy' }));
