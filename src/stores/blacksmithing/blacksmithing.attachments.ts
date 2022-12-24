import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelBlacksmithingJob, StartBlacksmithingJob } from './blacksmithing.actions';
import { cancelBlacksmithingJob, decreaseDuration, resetBlacksmithing, startBlacksmithingJob } from './blacksmithing.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetBlacksmithing },
  { action: StartBlacksmithingJob, handler: startBlacksmithingJob },
  { action: CancelBlacksmithingJob, handler: cancelBlacksmithingJob }
];
