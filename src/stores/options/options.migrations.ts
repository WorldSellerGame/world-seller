import { IOptions } from '../../interfaces';

export const optionsStoreMigrations = [
  {
    version: 0,
    migrate: (state: IOptions) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'options' }));
