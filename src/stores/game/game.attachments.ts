import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { SetStatGains } from './game.actions';
import { resetGame, setStatGains } from './game.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetGame },
  { action: SetStatGains, handler: setStatGains }
];
