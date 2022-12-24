import { IAttachment } from '../../interfaces/store';

import { CreateCharacter, DeleteCharacter, GainResources, SetActiveCharacter, SyncTotalLevel } from './charselect.actions';
import { createCharacter, deleteCharacter, gainResources, setActiveCharacter, syncTotalLevel } from './charselect.functions';

export const attachments: IAttachment[] = [
  { action: CreateCharacter, handler: createCharacter },
  { action: DeleteCharacter, handler: deleteCharacter },
  { action: SetActiveCharacter, handler: setActiveCharacter },
  { action: GainResources, handler: gainResources },
  { action: SyncTotalLevel, handler: syncTotalLevel }
];
