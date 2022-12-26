import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelHunting } from './hunting.actions';
import { cancelHunting, resetHunting } from './hunting.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetHunting },
  { action: CancelHunting, handler: cancelHunting }
];
