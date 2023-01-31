import { IPlayerCharacter } from './character';

export interface ICharSelect {
  version: number;
  characters: IPlayerCharacter[];
  currentCharacter: number;
}
