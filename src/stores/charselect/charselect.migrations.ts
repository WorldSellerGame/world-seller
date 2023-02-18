import { ICharSelect } from '../../interfaces';

export const charselectStoreMigrations = [
  {
    version: 0,
    migrate: (state: ICharSelect) => ({
      ...state,
      version: 1
    })
  },
  {
    version: 1,
    migrate: (state: ICharSelect) => ({
      ...state,
      version: 2,
      characters: state.characters.map(char => {
        if(char.discoveries) {
          return;
        }

        char.discoveries = {};
        return char;
      })
    })
  }
].map(x => ({ ...x, key: 'charselect' }));
