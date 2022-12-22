import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { resetGame } from './game.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetGame },
];
