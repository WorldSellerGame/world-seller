import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import {
  AssignFarmingWorker,
  AssignGatheringWorker, AssignMercantileWorker, AssignRefiningWorker,
  BuyWorker,
  UnassignFarmingWorker,
  UnassignGatheringWorker, UnassignMercantileWorker, UnassignRefiningWorker
} from './workers.actions';
import {
  assignFarmingWorker,
  assignGatheringWorker, assignMercantileWorker, assignRefiningWorker,
  buyWorker, resetWorkers, unassignFarmingWorker, unassignGatheringWorker, unassignMercantileWorker, unassignRefiningWorker
} from './workers.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetWorkers },
  { action: BuyWorker, handler: buyWorker },
  { action: AssignGatheringWorker, handler: assignGatheringWorker },
  { action: UnassignGatheringWorker, handler: unassignGatheringWorker },
  { action: AssignRefiningWorker, handler: assignRefiningWorker },
  { action: UnassignRefiningWorker, handler: unassignRefiningWorker },
  { action: AssignMercantileWorker, handler: assignMercantileWorker },
  { action: UnassignMercantileWorker, handler: unassignMercantileWorker },
  { action: AssignFarmingWorker, handler: assignFarmingWorker },
  { action: UnassignFarmingWorker, handler: unassignFarmingWorker }
];
