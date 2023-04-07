import { IGameGatherLocation, IGameRecipe } from '../../interfaces';

export class BuyWorker {
  static type = '[Workers] Buy';
  constructor() {}
}

export class AssignGatheringWorker {
  static type = '[Workers] Assign Gathering';
  constructor(public tradeskill: string, public location: IGameGatherLocation) {}
}

export class UnassignGatheringWorker {
  static type = '[Workers] Unassign Gathering';
  constructor(public tradeskill: string, public location: IGameGatherLocation) {}
}

export class AssignRefiningWorker {
  static type = '[Workers] Assign Refining';
  constructor(public tradeskill: string, public recipe: IGameRecipe) {}
}

export class UnassignRefiningWorker {
  static type = '[Workers] Unassign Refining';
  constructor(public tradeskill: string, public recipe: IGameRecipe) {}
}

export class AssignMercantileWorker {
  static type = '[Workers] Assign Mercantile';
  constructor() {}
}

export class UnassignMercantileWorker {
  static type = '[Workers] Unassign Mercantile';
  constructor() {}
}

export class AssignFarmingWorker {
  static type = '[Workers] Assign Farming';
  constructor() {}
}

export class UnassignFarmingWorker {
  static type = '[Workers] Unassign Farming';
  constructor() {}
}


