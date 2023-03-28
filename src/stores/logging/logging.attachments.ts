import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelLogging, GainLoggingLevels, StarLoggingLocation, UnlockLogging } from './logging.actions';
import { cancelLogging, gainLoggingLevels, resetLogging, starLoggingLocation, unlockLogging } from './logging.functions';


export const attachments: IAttachment[] = [
  { action: UnlockLogging, handler: unlockLogging },
  { action: GainLoggingLevels, handler: gainLoggingLevels },
  { action: DeleteCharacter, handler: resetLogging },
  { action: CancelLogging, handler: cancelLogging },
  { action: StarLoggingLocation, handler: starLoggingLocation }
];
