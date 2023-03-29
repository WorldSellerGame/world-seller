import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import {
  CancelJewelcraftingJob, ChangeJewelcraftingFilterOption,
  GainJewelcraftingLevels,
  StarJewelcraftingRecipe,
  StartJewelcraftingJob, UnlockJewelcrafting, UpgradeJewelcraftingQueue
} from './jewelcrafting.actions';
import {
  cancelJewelcraftingJob, changeJewelcraftingOption, decreaseDuration,
  gainJewelcraftingLevels,
  resetJewelcrafting, starJewelcraftingRecipe, startJewelcraftingJob, unlockJewelcrafting, upgradeJewelcraftingQueue
} from './jewelcrafting.functions';


export const attachments: IAttachment[] = [
  { action: UnlockJewelcrafting, handler: unlockJewelcrafting },
  { action: GainJewelcraftingLevels, handler: gainJewelcraftingLevels },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetJewelcrafting },
  { action: StartJewelcraftingJob, handler: startJewelcraftingJob },
  { action: CancelJewelcraftingJob, handler: cancelJewelcraftingJob },
  { action: ChangeJewelcraftingFilterOption, handler: changeJewelcraftingOption },
  { action: StarJewelcraftingRecipe, handler: starJewelcraftingRecipe },
  { action: UpgradeJewelcraftingQueue, handler: upgradeJewelcraftingQueue }
];
