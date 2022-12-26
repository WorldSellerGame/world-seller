import { IGameFarming } from '../../interfaces';

export const farmingStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameFarming) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'farming' }));
