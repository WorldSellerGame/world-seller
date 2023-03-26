import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelForaging, GainForagingLevels, UnlockForaging } from './foraging.actions';
import { cancelForaging, gainForagingLevels, resetForaging, unlockForaging } from './foraging.functions';


export const attachments: IAttachment[] = [
  { action: UnlockForaging, handler: unlockForaging },
  { action: GainForagingLevels, handler: gainForagingLevels },
  { action: DeleteCharacter, handler: resetForaging },
  { action: CancelForaging, handler: cancelForaging }
];
