import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import {
  CancelWeavingJob, ChangeWeavingFilterOption, GainWeavingLevels,
  StarWeavingRecipe, StartWeavingJob, UnlockWeaving, UpgradeWeavingQueue
} from './weaving.actions';
import {
  cancelWeavingJob, changeWeavingOption, decreaseDuration,
  gainWeavingLevels, resetWeaving, starWeavingRecipe, startWeavingJob, unlockWeaving, upgradeWeavingQueue
} from './weaving.functions';


export const attachments: IAttachment[] = [
  { action: UnlockWeaving, handler: unlockWeaving },
  { action: GainWeavingLevels, handler: gainWeavingLevels },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetWeaving },
  { action: StartWeavingJob, handler: startWeavingJob },
  { action: CancelWeavingJob, handler: cancelWeavingJob },
  { action: ChangeWeavingFilterOption, handler: changeWeavingOption },
  { action: StarWeavingRecipe, handler: starWeavingRecipe },
  { action: UpgradeWeavingQueue, handler: upgradeWeavingQueue }
];
