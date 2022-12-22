import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelForaging, SetForagingLocation } from './foraging.actions';
import { cancelForaging, decreaseDuration, resetForaging, setForagingLocation } from './foraging.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetForaging },
  { action: SetForagingLocation, handler: setForagingLocation },
  { action: CancelForaging, handler: cancelForaging }
];
