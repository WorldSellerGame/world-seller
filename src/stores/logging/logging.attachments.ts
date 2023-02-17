import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelLogging, UnlockLogging } from './logging.actions';
import { cancelLogging, resetLogging, unlockLogging } from './logging.functions';


export const attachments: IAttachment[] = [
  { action: UnlockLogging, handler: unlockLogging },
  { action: DeleteCharacter, handler: resetLogging },
  { action: CancelLogging, handler: cancelLogging }
];
