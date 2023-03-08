import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import {
  AssignGatheringWorker, AssignMercantileWorker, AssignRefiningWorker,
  BuyWorker,
  UnassignGatheringWorker, UnassignMercantileWorker, UnassignRefiningWorker
} from './workers.actions';
import {
  assignGatheringWorker, assignMercantileWorker, assignRefiningWorker,
  buyWorker, resetWorkers, unassignGatheringWorker, unassignMercantileWorker, unassignRefiningWorker
} from './workers.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetWorkers },
  { action: BuyWorker, handler: buyWorker },
  { action: AssignGatheringWorker, handler: assignGatheringWorker },
  { action: UnassignGatheringWorker, handler: unassignGatheringWorker },
  { action: AssignRefiningWorker, handler: assignRefiningWorker },
  { action: UnassignRefiningWorker, handler: unassignRefiningWorker },
  { action: AssignMercantileWorker, handler: assignMercantileWorker },
  { action: UnassignMercantileWorker, handler: unassignMercantileWorker }
];
