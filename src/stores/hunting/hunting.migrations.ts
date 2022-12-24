import { IGameGathering } from '../../interfaces';

export const huntingStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameGathering) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'hunting' }));
