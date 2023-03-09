import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { GainProspectingLevels, ProspectRock, UnlockProspecting } from './prospecting.actions';
import { decreaseDuration, gainProspectingLevels, prospectRock, resetProspecting, unlockProspecting } from './prospecting.functions';


export const attachments: IAttachment[] = [
  { action: UnlockProspecting, handler: unlockProspecting },
  { action: GainProspectingLevels, handler: gainProspectingLevels },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetProspecting },
  { action: ProspectRock, handler: prospectRock }
];
