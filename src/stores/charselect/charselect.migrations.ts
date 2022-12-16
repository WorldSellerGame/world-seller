import { ICharSelect } from '../../interfaces';

export const charselectStoreMigrations = [
  {
    version: 0,
    migrate: (state: ICharSelect) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'charselect' }));
