import { IAttachment } from '../../interfaces/store';
import {
  QuickSellItemFromInventory, QuickSellManyItemsFromInventory,
  SellItem, SendManyItemsToInventory, SendManyItemsToStockpile, SendToInventory, SendToStockpile
} from '../mercantile/mercantile.actions';

import {
  AddItemToInventory, BreakItem, CreateCharacter, DeleteCharacter,
  EquipItem, GainResources, RemoveItemFromInventory, SaveActiveCharacter,
  SetActiveCharacter, SyncTotalLevel, ToggleCharacterCloud, UnequipItem, UnlinkCharacterCloud
} from './charselect.actions';
import {
  addItemToInventory, addItemsToInventory, breakItem, createCharacter, deleteCharacter,
  equipItem, gainResources, removeItemFromInventory,
  removeItemsFromInventory, saveCurrentCharacter, setActiveCharacter,
  syncTotalLevel, toggleCharacterCloud, unequipItem, unlinkCharacterCloud
} from './charselect.functions';

export const attachments: IAttachment[] = [
  { action: CreateCharacter, handler: createCharacter },
  { action: ToggleCharacterCloud, handler: toggleCharacterCloud },
  { action: UnlinkCharacterCloud, handler: unlinkCharacterCloud },
  { action: DeleteCharacter, handler: deleteCharacter },
  { action: SetActiveCharacter, handler: setActiveCharacter },
  { action: SaveActiveCharacter, handler: saveCurrentCharacter },
  { action: GainResources, handler: gainResources },

  { action: AddItemToInventory, handler: addItemToInventory },
  { action: SendManyItemsToInventory, handler: addItemsToInventory },
  { action: SendToInventory, handler: addItemToInventory },

  { action: RemoveItemFromInventory, handler: removeItemFromInventory },
  { action: SendToStockpile, handler: removeItemFromInventory },
  { action: SendManyItemsToStockpile, handler: removeItemsFromInventory },
  { action: QuickSellItemFromInventory, handler: removeItemFromInventory },
  { action: QuickSellManyItemsFromInventory, handler: removeItemsFromInventory },
  { action: SellItem, handler: removeItemFromInventory },
  { action: BreakItem, handler: breakItem },

  { action: EquipItem, handler: equipItem },
  { action: UnequipItem, handler: unequipItem },
  { action: SyncTotalLevel, handler: syncTotalLevel }
];
