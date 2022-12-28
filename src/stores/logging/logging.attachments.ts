import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelLogging } from './logging.actions';
import { cancelLogging, resetLogging } from './logging.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetLogging },
  { action: CancelLogging, handler: cancelLogging }
];
