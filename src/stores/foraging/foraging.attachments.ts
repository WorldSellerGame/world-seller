import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelForaging, GainForagingLevels, StarForagingLocation, UnlockForaging } from './foraging.actions';
import { cancelForaging, gainForagingLevels, resetForaging, starForagingLocation, unlockForaging } from './foraging.functions';


export const attachments: IAttachment[] = [
  { action: UnlockForaging, handler: unlockForaging },
  { action: GainForagingLevels, handler: gainForagingLevels },
  { action: DeleteCharacter, handler: resetForaging },
  { action: CancelForaging, handler: cancelForaging },
  { action: StarForagingLocation, handler: starForagingLocation }
];
