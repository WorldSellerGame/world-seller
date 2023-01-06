import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import {
  GainCoins, QuickSellAllFromStockpile, QuickSellItemFromInventory, QuickSellItemFromStockpile,
  SellItem, SendToInventory, SendToStockpile, SpendCoins, UnsellItem, UpgradeShopCounter, UpgradeShopDecorations,
  UpgradeShopRegister, UpgradeStockpileSize
} from './mercantile.actions';
import {
  decreaseDuration, gainCoins, quickSellAllFromStockpile, quickSellFromInventory, quickSellItemFromStockpile,
  removeFromStockpile,
  resetMercantile,
  sellItem,
  sendToStockpile, spendCoins, unsellItem, upgradeShopCounter, upgradeShopDecorations, upgradeShopRegister, upgradeStockpileSize
} from './mercantile.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetMercantile },
  { action: GainCoins, handler: gainCoins },
  { action: SpendCoins, handler: spendCoins },
  { action: SellItem, handler: sellItem },
  { action: UnsellItem, handler: unsellItem },
  { action: SendToStockpile, handler: sendToStockpile },
  { action: SendToInventory, handler: removeFromStockpile },
  { action: QuickSellItemFromInventory, handler: quickSellFromInventory },
  { action: QuickSellItemFromStockpile, handler: quickSellItemFromStockpile },
  { action: QuickSellAllFromStockpile, handler: quickSellAllFromStockpile },
  { action: UpgradeStockpileSize, handler: upgradeStockpileSize },
  { action: UpgradeShopRegister, handler: upgradeShopRegister },
  { action: UpgradeShopCounter, handler: upgradeShopCounter },
  { action: UpgradeShopDecorations, handler: upgradeShopDecorations },
  { action: UpgradeStockpileSize, handler: upgradeStockpileSize }
];
