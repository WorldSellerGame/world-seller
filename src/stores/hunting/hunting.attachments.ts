import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { CancelHunting, GainHuntingLevels, UnlockHunting } from './hunting.actions';
import { cancelHunting, gainHuntingLevels, resetHunting, unlockHunting } from './hunting.functions';


export const attachments: IAttachment[] = [
  { action: UnlockHunting, handler: unlockHunting },
  { action: GainHuntingLevels, handler: gainHuntingLevels },
  { action: DeleteCharacter, handler: resetHunting },
  { action: CancelHunting, handler: cancelHunting }
];
