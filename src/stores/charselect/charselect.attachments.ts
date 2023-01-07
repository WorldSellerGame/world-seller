import { IAttachment } from '../../interfaces/store';
import { QuickSellItemFromInventory, SellItem, SendToInventory, SendToStockpile } from '../mercantile/mercantile.actions';

import {
  AddItemToInventory, CreateCharacter, DeleteCharacter,
  EquipItem, GainResources, RemoveItemFromInventory, SaveActiveCharacter, SetActiveCharacter, SyncTotalLevel, UnequipItem
} from './charselect.actions';
import {
  addItemToInventory, createCharacter, deleteCharacter,
  equipItem, gainResources, removeItemFromInventory, saveCurrentCharacter, setActiveCharacter, syncTotalLevel, unequipItem
} from './charselect.functions';

export const attachments: IAttachment[] = [
  { action: CreateCharacter, handler: createCharacter },
  { action: DeleteCharacter, handler: deleteCharacter },
  { action: SetActiveCharacter, handler: setActiveCharacter },
  { action: SaveActiveCharacter, handler: saveCurrentCharacter },
  { action: GainResources, handler: gainResources },

  { action: AddItemToInventory, handler: addItemToInventory },
  { action: SendToInventory, handler: addItemToInventory },

  { action: RemoveItemFromInventory, handler: removeItemFromInventory },
  { action: SendToStockpile, handler: removeItemFromInventory },
  { action: QuickSellItemFromInventory, handler: removeItemFromInventory },
  { action: SellItem, handler: removeItemFromInventory },

  { action: EquipItem, handler: equipItem },
  { action: UnequipItem, handler: unequipItem },
  { action: SyncTotalLevel, handler: syncTotalLevel }
];
