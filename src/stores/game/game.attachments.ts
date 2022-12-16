import { IAttachment } from '../../interfaces/store';

import { SetActiveCharacter } from './game.actions';
import { setActiveCharacter } from './game.functions';

export const attachments: IAttachment[] = [
  { action: SetActiveCharacter, handler: setActiveCharacter }
];
