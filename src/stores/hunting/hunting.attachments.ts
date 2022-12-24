import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelHunting, SetHuntingLocation } from './hunting.actions';
import { cancelHunting, decreaseDuration, resetHunting, setHuntingLocation } from './hunting.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetHunting },
  { action: SetHuntingLocation, handler: setHuntingLocation },
  { action: CancelHunting, handler: cancelHunting }
];
