import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import {
  CancelBlacksmithingJob, ChangeBlacksmithingFilterOption,
  GainBlacksmithingLevels,
  StarBlacksmithingRecipe,
  StartBlacksmithingJob, UnlockBlacksmithing, UpgradeBlacksmithingQueue
} from './blacksmithing.actions';
import {
  cancelBlacksmithingJob, changeBlacksmithingOption, decreaseDuration,
  gainBlacksmithingLevels,
  resetBlacksmithing, starBlacksmithingRecipe, startBlacksmithingJob, unlockBlacksmithing, upgradeBlacksmithingQueue
} from './blacksmithing.functions';


export const attachments: IAttachment[] = [
  { action: UnlockBlacksmithing, handler: unlockBlacksmithing },
  { action: GainBlacksmithingLevels, handler: gainBlacksmithingLevels },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetBlacksmithing },
  { action: StartBlacksmithingJob, handler: startBlacksmithingJob },
  { action: CancelBlacksmithingJob, handler: cancelBlacksmithingJob },
  { action: ChangeBlacksmithingFilterOption, handler: changeBlacksmithingOption },
  { action: StarBlacksmithingRecipe, handler: starBlacksmithingRecipe },
  { action: UpgradeBlacksmithingQueue, handler: upgradeBlacksmithingQueue }
];
