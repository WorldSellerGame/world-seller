import { IAttachment } from '../../interfaces/store';
import { TickTimer } from '../game/game.actions';
import { CancelFishing, SetFishingLocation } from './fishing.actions';
import { cancelFishing, decreaseDuration, setFishingLocation } from './fishing.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: SetFishingLocation, handler: setFishingLocation },
  { action: CancelFishing, handler: cancelFishing }
];
