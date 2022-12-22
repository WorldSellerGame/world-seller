import { IAttachment } from '../../interfaces/store';
import { TickTimer } from '../game/game.actions';
import { CancelForaging, SetForagingLocation } from './foraging.actions';
import { cancelForaging, decreaseDuration, setForagingLocation } from './foraging.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: SetForagingLocation, handler: setForagingLocation },
  { action: CancelForaging, handler: cancelForaging }
];
