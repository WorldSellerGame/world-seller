import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelMining, GainMiningLevels, UnlockMining } from './mining.actions';
import { cancelMining, gainMiningLevels, resetMining, unlockMining } from './mining.functions';


export const attachments: IAttachment[] = [
  { action: UnlockMining, handler: unlockMining },
  { action: GainMiningLevels, handler: gainMiningLevels },
  { action: DeleteCharacter, handler: resetMining },
  { action: CancelMining, handler: cancelMining }
];
