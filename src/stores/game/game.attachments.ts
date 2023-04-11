import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { SetStatGains, UpdateFirebaseUID } from './game.actions';
import { resetGame, setFirebaseUID, setStatGains } from './game.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetGame },
  { action: SetStatGains, handler: setStatGains },
  { action: UpdateFirebaseUID, handler: setFirebaseUID }
];
