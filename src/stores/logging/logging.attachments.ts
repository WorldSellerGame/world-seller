import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelLogging, GainLoggingLevels, UnlockLogging } from './logging.actions';
import { cancelLogging, gainLoggingLevels, resetLogging, unlockLogging } from './logging.functions';


export const attachments: IAttachment[] = [
  { action: UnlockLogging, handler: unlockLogging },
  { action: GainLoggingLevels, handler: gainLoggingLevels },
  { action: DeleteCharacter, handler: resetLogging },
  { action: CancelLogging, handler: cancelLogging }
];
