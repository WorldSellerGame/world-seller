import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelMining, GainMiningLevels, StarMiningLocation, UnlockMining } from './mining.actions';
import { cancelMining, gainMiningLevels, resetMining, starMiningLocation, unlockMining } from './mining.functions';


export const attachments: IAttachment[] = [
  { action: UnlockMining, handler: unlockMining },
  { action: GainMiningLevels, handler: gainMiningLevels },
  { action: DeleteCharacter, handler: resetMining },
  { action: CancelMining, handler: cancelMining },
  { action: StarMiningLocation, handler: starMiningLocation }
];
