import { IOptions } from '../../interfaces';

export const optionsStoreMigrations = [
  {
    version: 0,
    migrate: (state: IOptions) => ({
      version: 1,
      ...state
    })
  }
].map(x => ({ ...x, key: 'options' }));
