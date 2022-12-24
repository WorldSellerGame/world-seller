import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelMining, SetMiningLocation } from './mining.actions';
import { cancelMining, decreaseDuration, resetMining, setMiningLocation } from './mining.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetMining },
  { action: SetMiningLocation, handler: setMiningLocation },
  { action: CancelMining, handler: cancelMining }
];
