import { IGameGathering } from '../../interfaces';

export const loggingStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameGathering) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'logging' }));
