import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelJewelcraftingJob, StartJewelcraftingJob, UnlockJewelcrafting } from './jewelcrafting.actions';
import {
  cancelJewelcraftingJob, decreaseDuration,
  resetJewelcrafting, startJewelcraftingJob, unlockJewelcrafting
} from './jewelcrafting.functions';


export const attachments: IAttachment[] = [
  { action: UnlockJewelcrafting, handler: unlockJewelcrafting },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetJewelcrafting },
  { action: StartJewelcraftingJob, handler: startJewelcraftingJob },
  { action: CancelJewelcraftingJob, handler: cancelJewelcraftingJob }
];
