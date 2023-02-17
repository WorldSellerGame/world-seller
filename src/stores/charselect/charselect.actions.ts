import { IGameItem, ItemType } from '../../interfaces';

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

export class SaveActiveCharacter {
  static type = '[CharSelect] Save Active Character';
  constructor() {}
}

export class DiscoverResourceOrItem {
  static type = '[CharSelect] Discover Resource Or Item';
  constructor(public itemName: string) {}
}

export class GainResources {
  static type = '[CharSelect] Gain Resources';
  constructor(public resources: Record<string, number>, public shouldNotify = true) {}
}

export class GainItemOrResource {
  static type = '[CharSelect] Gain Item Or Resource';
  constructor(public itemName: string, public quantity = 1) {}
}

export class WorkerCreateItem {
  static type = '[CharSelect] Worker Create Item';
  constructor(public itemName: string, public quantity = 1) {}
}

export class SyncTotalLevel {
  static type = '[CharSelect] Sync Total Level';
  constructor(public newLevel = 0) {}
}

export class AddItemToInventory {
  static type = '[CharSelect] Add Item To Inventory';
  constructor(public item: IGameItem) {}
}

export class RemoveItemFromInventory {
  static type = '[CharSelect] Remove Item From Inventory';
  constructor(public item: IGameItem) {}
}

export class EquipItem {
  static type = '[CharSelect] Equip Item';
  constructor(public item: IGameItem) {}
}

export class UnequipItem {
  static type = '[CharSelect] Unequip Item';
  constructor(public slot: ItemType) {}
}

export class BreakItem {
  static type = '[CharSelect] Break Item';
  constructor(public slot: ItemType) {}
}

export class DecreaseDurability {
  static type = '[CharSelect] Decrease Durability';
  constructor(public slot: ItemType) {}
}
