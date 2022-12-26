import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { HarvestPlantFromFarm, PlantSeedInFarm } from './farming.actions';
import { decreaseDuration, harvestPlot, plantSeedInFarm, resetFarming } from './farming.functions';


export const attachments: IAttachment[] = [
  { action: TickTimer, handler: decreaseDuration },
  { action: DeleteCharacter, handler: resetFarming },
  { action: PlantSeedInFarm, handler: plantSeedInFarm },
  { action: HarvestPlantFromFarm, handler: harvestPlot }
];
