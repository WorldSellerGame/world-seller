import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import {
  GainCoins, GainMercantileLevels, QuickSellAllFromStockpile, QuickSellItemFromInventory, QuickSellItemFromStockpile,
  QuickSellManyItemsFromInventory,
  QuickSellManyItemsFromStockpile,
  RemoveFromStockpile,
  RotateExchangeGoods,
  SellItem, SendManyItemsToInventory, SendManyItemsToStockpile, SendToInventory, SendToStockpile, SpendCoins, UnlockMercantile,
  UnsellItem, UpgradeExchange, UpgradeShopCounter, UpgradeShopDecorations,
  UpgradeShopRegister, UpgradeStockpileSize, UpgradeWorkerSellRate
} from './mercantile.actions';
import {
  decreaseDuration, gainCoins, gainMercantileLevels, quickSellAllFromStockpile, quickSellFromInventory, quickSellItemFromStockpile,
  quickSellManyItemsFromInventory,
  quickSellManyItemsFromStockpile,
  removeFromStockpile,
  removeManyFromStockpile,
  resetMercantile,
  rotateExchange,
  sellItem,
  sendManyItemsToStockpile,
  sendToStockpile, spendCoins, unlockMercantile, unsellItem,
  upgradeExchange,
  upgradeShopCounter, upgradeShopDecorations, upgradeShopRegister, upgradeStockpileSize, upgradeWorkerSellRate
} from './mercantile.functions';


export const attachments: IAttachment[] = [
  { action: UnlockMercantile, handler: unlockMercantile },
  { action: GainMercantileLevels, handler: gainMercantileLevels },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetMercantile },
  { action: GainCoins, handler: gainCoins },
  { action: SpendCoins, handler: spendCoins },
  { action: SellItem, handler: sellItem },
  { action: UnsellItem, handler: unsellItem },
  { action: SendToStockpile, handler: sendToStockpile },
  { action: SendManyItemsToStockpile, handler: sendManyItemsToStockpile },
  { action: RemoveFromStockpile, handler: removeFromStockpile },
  { action: SendToInventory, handler: removeFromStockpile },
  { action: SendManyItemsToInventory, handler: removeManyFromStockpile },
  { action: QuickSellItemFromInventory, handler: quickSellFromInventory },
  { action: QuickSellManyItemsFromInventory, handler: quickSellManyItemsFromInventory },
  { action: QuickSellItemFromStockpile, handler: quickSellItemFromStockpile },
  { action: QuickSellManyItemsFromStockpile, handler: quickSellManyItemsFromStockpile },
  { action: QuickSellAllFromStockpile, handler: quickSellAllFromStockpile },
  { action: UpgradeShopRegister, handler: upgradeShopRegister },
  { action: UpgradeShopCounter, handler: upgradeShopCounter },
  { action: UpgradeShopDecorations, handler: upgradeShopDecorations },
  { action: UpgradeStockpileSize, handler: upgradeStockpileSize },
  { action: UpgradeWorkerSellRate, handler: upgradeWorkerSellRate },
  { action: RotateExchangeGoods, handler: rotateExchange },
  { action: UpgradeExchange, handler: upgradeExchange }
];
