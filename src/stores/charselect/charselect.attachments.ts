import { IAttachment } from '../../interfaces/store';

import { AddItemToInventory, CreateCharacter, DeleteCharacter,
  EquipItem, GainResources, RemoveItemFromInventory, SetActiveCharacter, SyncTotalLevel, UnequipItem } from './charselect.actions';
import { addItemToInventory, createCharacter, deleteCharacter,
  equipItem, gainResources, removeItemFromInventory, setActiveCharacter, syncTotalLevel, unequipItem } from './charselect.functions';

export const attachments: IAttachment[] = [
  { action: CreateCharacter, handler: createCharacter },
  { action: DeleteCharacter, handler: deleteCharacter },
  { action: SetActiveCharacter, handler: setActiveCharacter },
  { action: GainResources, handler: gainResources },
  { action: AddItemToInventory, handler: addItemToInventory },
  { action: RemoveItemFromInventory, handler: removeItemFromInventory },
  { action: EquipItem, handler: equipItem },
  { action: UnequipItem, handler: unequipItem },
  { action: SyncTotalLevel, handler: syncTotalLevel }
];
