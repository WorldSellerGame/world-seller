import { IAttachment } from '../../interfaces/store';
import { TickTimer } from '../game/game.actions';
import { CancelLogging, SetLoggingLocation } from './logging.actions';
import { cancelLogging, decreaseDuration, setLoggingLocation } from './logging.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: SetLoggingLocation, handler: setLoggingLocation },
  { action: CancelLogging, handler: cancelLogging }
];
