import { IGameMods } from '../../interfaces';

export const modsStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameMods) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'mods' }));
