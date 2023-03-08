import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelWeavingJob, StartWeavingJob, UnlockWeaving } from './weaving.actions';
import { cancelWeavingJob, decreaseDuration, resetWeaving, startWeavingJob, unlockWeaving } from './weaving.functions';


export const attachments: IAttachment[] = [
  { action: UnlockWeaving, handler: unlockWeaving },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetWeaving },
  { action: StartWeavingJob, handler: startWeavingJob },
  { action: CancelWeavingJob, handler: cancelWeavingJob }
];
