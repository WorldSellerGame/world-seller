import { IGameRefining } from '../../interfaces';

export const weavingStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameRefining) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'weaving' }));
