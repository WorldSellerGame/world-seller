import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelFishing, UnlockFishing } from './fishing.actions';
import { cancelFishing, resetFishing, unlockFishing } from './fishing.functions';


export const attachments: IAttachment[] = [
  { action: UnlockFishing, handler: unlockFishing },
  { action: DeleteCharacter, handler: resetFishing },
  { action: CancelFishing, handler: cancelFishing }
];
