import { IGameProspecting } from '../../interfaces';

export const prospectingStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameProspecting) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'prospecting' }));
