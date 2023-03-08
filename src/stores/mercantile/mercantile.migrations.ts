import { IGameMercantile } from '../../interfaces';

export const mercantileStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameMercantile) => ({
      ...state,
      version: 1
    })
  },
  {
    version: 1,
    migrate: (state: IGameMercantile) => {
      state.version = 2;

      if(!state.exchange) {
        state.exchange = {
          items: [],
          currentTick: 0,
          lastPaidForRotate: 0,
          exchangeLevel: 0
        };
      }

      return state;
    }
  }
].map(x => ({ ...x, key: 'mercantile' }));
