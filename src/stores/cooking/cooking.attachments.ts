import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import {
  CancelCookingJob, ChangeCookingFilterOption, GainCookingLevels,
  StarCookingRecipe, StartCookingJob, UnlockCooking
} from './cooking.actions';
import {
  cancelCookingJob, changeCookingOption, decreaseDuration,
  gainCookingLevels, resetCooking, starCookingRecipe, startCookingJob, unlockCooking
} from './cooking.functions';


export const attachments: IAttachment[] = [
  { action: UnlockCooking, handler: unlockCooking },
  { action: GainCookingLevels, handler: gainCookingLevels },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetCooking },
  { action: StartCookingJob, handler: startCookingJob },
  { action: CancelCookingJob, handler: cancelCookingJob },
  { action: ChangeCookingFilterOption, handler: changeCookingOption },
  { action: StarCookingRecipe, handler: starCookingRecipe }
];
