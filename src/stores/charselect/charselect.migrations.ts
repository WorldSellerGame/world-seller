
import { v4 as uuidv4 } from 'uuid';

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
          return char;
        }

        char.discoveries = {};
        return char;
      })
    })
  },
  {
    version: 2,
    migrate: (state: ICharSelect) => ({
      ...state,
      version: 3,
      characters: state.characters.map(char => {
        char.id = uuidv4();
        return char;
      })
    })
  }
].map(x => ({ ...x, key: 'charselect' }));
