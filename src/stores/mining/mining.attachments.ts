import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelMining } from './mining.actions';
import { cancelMining, resetMining } from './mining.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetMining },
  { action: CancelMining, handler: cancelMining }
];
