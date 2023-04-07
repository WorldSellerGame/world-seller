import { IGameWorkers } from '../../interfaces';

export const workerStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameWorkers) => ({
      ...state,
      version: 1
    })
  },
  {
    version: 1,
    migrate: (state: IGameWorkers) => ({
      ...state,
      version: 2,
      farmingWorkerAllocations: []
    })
  }
].map(x => ({ ...x, key: 'workers' }));
