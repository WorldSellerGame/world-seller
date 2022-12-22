import { IGameGathering } from '../../interfaces';

export const foargingStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameGathering) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'foraging' }));
