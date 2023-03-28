import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelFishing, GainFishingLevels, StarFishingLocation, UnlockFishing } from './fishing.actions';
import { cancelFishing, gainFishingLevels, resetFishing, starFishingLocation, unlockFishing } from './fishing.functions';


export const attachments: IAttachment[] = [
  { action: UnlockFishing, handler: unlockFishing },
  { action: GainFishingLevels, handler: gainFishingLevels },
  { action: DeleteCharacter, handler: resetFishing },
  { action: CancelFishing, handler: cancelFishing },
  { action: StarFishingLocation, handler: starFishingLocation }
];
