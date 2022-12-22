import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelFishing, SetFishingLocation } from './fishing.actions';
import { cancelFishing, decreaseDuration, resetFishing, setFishingLocation } from './fishing.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetFishing },
  { action: SetFishingLocation, handler: setFishingLocation },
  { action: CancelFishing, handler: cancelFishing }
];
