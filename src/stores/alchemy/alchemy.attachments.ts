import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelAlchemyJob, StartAlchemyJob } from './alchemy.actions';
import { cancelAlchemyJob, decreaseDuration, resetAlchemy, startAlchemyJob } from './alchemy.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetAlchemy },
  { action: StartAlchemyJob, handler: startAlchemyJob },
  { action: CancelAlchemyJob, handler: cancelAlchemyJob }
];
