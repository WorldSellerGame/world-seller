import { IGameMercantile } from '../../interfaces';

export const mercantileStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameMercantile) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'mercantile' }));
