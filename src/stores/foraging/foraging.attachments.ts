import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelForaging } from './foraging.actions';
import { cancelForaging, resetForaging } from './foraging.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetForaging },
  { action: CancelForaging, handler: cancelForaging }
];
