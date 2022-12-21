import { IAttachment } from '../../interfaces/store';
import { TickTimer } from '../game/game.actions';
import { CancelMining, SetMiningLocation } from './mining.actions';
import { cancelMining, decreaseDuration, setMiningLocation } from './mining.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: SetMiningLocation, handler: setMiningLocation },
  { action: CancelMining, handler: cancelMining }
];
