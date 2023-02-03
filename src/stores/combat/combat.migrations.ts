import { IGameCombat } from '../../interfaces';

export const combatStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameCombat) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'combat' }));
