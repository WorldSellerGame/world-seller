import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelForaging, UnlockForaging } from './foraging.actions';
import { cancelForaging, resetForaging, unlockForaging } from './foraging.functions';


export const attachments: IAttachment[] = [
  { action: UnlockForaging, handler: unlockForaging },
  { action: DeleteCharacter, handler: resetForaging },
  { action: CancelForaging, handler: cancelForaging }
];
