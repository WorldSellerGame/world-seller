import { IAttachment } from '../../interfaces/store';

import { CreateCharacter, DeleteCharacter } from './charselect.actions';
import { createCharacter, deleteCharacter } from './charselect.functions';

export const attachments: IAttachment[] = [
  { action: CreateCharacter, handler: createCharacter },
  { action: DeleteCharacter, handler: deleteCharacter }
];
