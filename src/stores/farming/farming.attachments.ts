import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { HarvestPlantFromFarm, PlantSeedInFarm, UnlockFarming } from './farming.actions';
import { decreaseDuration, harvestPlot, plantSeedInFarm, resetFarming, unlockFarming } from './farming.functions';


export const attachments: IAttachment[] = [
  { action: UnlockFarming, handler: unlockFarming },
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetFarming },
  { action: PlantSeedInFarm, handler: plantSeedInFarm },
  { action: HarvestPlantFromFarm, handler: harvestPlot }
];
