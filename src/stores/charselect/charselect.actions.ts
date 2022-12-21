
export class CreateCharacter {
  static type = '[CharSelect] Create Character';
  constructor(public name: string) {}
}

export class DeleteCharacter {
  static type = '[CharSelect] Delete Character';
  constructor(public slot: number) {}
}

export class SetActiveCharacter {
  static type = '[CharSelect] Set Active Character';
  constructor(public charSlot: number) {}
}

export class GainResources {
  static type = '[CharSelect] Gain Resources';
  constructor(public resources: Record<string, number>) {}
}

export class SyncTotalLevel {
  static type = '[CharSelect] Sync Total Level';
  constructor(public newLevel = 0) {}
}
