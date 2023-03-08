import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelCookingJob, StartCookingJob, UnlockCooking } from './cooking.actions';
import { cancelCookingJob, decreaseDuration, resetCooking, startCookingJob, unlockCooking } from './cooking.functions';


export const attachments: IAttachment[] = [
  { action: UnlockCooking, handler: unlockCooking },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetCooking },
  { action: StartCookingJob, handler: startCookingJob },
  { action: CancelCookingJob, handler: cancelCookingJob }
];
