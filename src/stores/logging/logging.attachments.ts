import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelLogging, SetLoggingLocation } from './logging.actions';
import { cancelLogging, decreaseDuration, resetLogging, setLoggingLocation } from './logging.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetLogging },
  { action: SetLoggingLocation, handler: setLoggingLocation },
  { action: CancelLogging, handler: cancelLogging }
];
