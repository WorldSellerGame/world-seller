import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelHunting, UnlockHunting } from './hunting.actions';
import { cancelHunting, resetHunting, unlockHunting } from './hunting.functions';


export const attachments: IAttachment[] = [
  { action: UnlockHunting, handler: unlockHunting },
  { action: DeleteCharacter, handler: resetHunting },
  { action: CancelHunting, handler: cancelHunting }
];
