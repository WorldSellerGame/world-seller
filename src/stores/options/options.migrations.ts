import { GameOption, IOptions } from '../../interfaces';

export const optionsStoreMigrations = [
  {
    version: 0,
    migrate: (state: IOptions) => ({
      ...state,
      version: 1
    })
  },
  {
    version: 1,
    migrate: (state: IOptions) => ({
      ...state,
      [GameOption.ShowNotifications]: true,
      version: 2
    })
  }
].map(x => ({ ...x, key: 'options' }));
