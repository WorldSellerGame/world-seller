import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { BuyNewPlot, GainFarmingLevels, HarvestPlantFromFarm, PlantSeedInFarm, UnlockFarming, UpgradeWorkerSpeed } from './farming.actions';
import {
  addPlot, decreaseDuration, gainFarmingLevels,
  harvestPlot, plantSeedInFarm, resetFarming, unlockFarming, upgradeWorkerSpeed
} from './farming.functions';


export const attachments: IAttachment[] = [
  { action: UnlockFarming, handler: unlockFarming },
  { action: GainFarmingLevels, handler: gainFarmingLevels },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetFarming },
  { action: PlantSeedInFarm, handler: plantSeedInFarm },
  { action: HarvestPlantFromFarm, handler: harvestPlot },
  { action: BuyNewPlot, handler: addPlot },
  { action: UpgradeWorkerSpeed, handler: upgradeWorkerSpeed }
];
