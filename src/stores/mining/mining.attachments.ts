import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelMining, UnlockMining } from './mining.actions';
import { cancelMining, resetMining, unlockMining } from './mining.functions';


export const attachments: IAttachment[] = [
  { action: UnlockMining, handler: unlockMining },
  { action: DeleteCharacter, handler: resetMining },
  { action: CancelMining, handler: cancelMining }
];
