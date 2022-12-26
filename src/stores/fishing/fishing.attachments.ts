import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelFishing } from './fishing.actions';
import { cancelFishing, resetFishing } from './fishing.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetFishing },
  { action: CancelFishing, handler: cancelFishing }
];
