import { IAttachment } from '../../interfaces/store';

import { CreateCharacter } from './charselect.actions';
import { createCharacter } from './charselect.functions';

export const attachments: IAttachment[] = [
  { action: CreateCharacter, handler: createCharacter }
];
