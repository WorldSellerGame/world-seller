import { IAttachment } from '../../interfaces/store';
import { TickTimer } from '../game/game.actions';
import { CancelHunting, SetHuntingLocation } from './hunting.actions';
import { cancelHunting, decreaseDuration, setHuntingLocation } from './hunting.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: SetHuntingLocation, handler: setHuntingLocation },
  { action: CancelHunting, handler: cancelHunting }
];
