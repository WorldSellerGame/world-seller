import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { ProspectRock, UnlockProspecting } from './prospecting.actions';
import { decreaseDuration, prospectRock, resetProspecting, unlockProspecting } from './prospecting.functions';


export const attachments: IAttachment[] = [
  { action: UnlockProspecting, handler: unlockProspecting },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetProspecting },
  { action: ProspectRock, handler: prospectRock }
];
