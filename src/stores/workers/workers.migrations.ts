import { IGameWorkers } from '../../interfaces';

export const workerStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameWorkers) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'workers' }));
