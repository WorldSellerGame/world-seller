import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { ProspectRock } from './prospecting.actions';
import { decreaseDuration, prospectRock, resetProspecting } from './prospecting.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetProspecting },
  { action: ProspectRock, handler: prospectRock }
];
