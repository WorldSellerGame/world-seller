import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameItem, ItemType } from '../../../interfaces';
import { CharSelectState } from '../../../stores';
import { EquipItem } from '../../../stores/charselect/charselect.actions';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.page.html',
  styleUrls: ['./equipment.page.scss'],
})
export class EquipmentPage implements OnInit {

  @Select(CharSelectState.activeCharacterEquipment) equipment$!: Observable<Partial<Record<ItemType, IGameItem>>>;

  public currentEquipSlot: ItemType | undefined;
  public equippableItems: IGameItem[] = [];

  public toolSlots = [
    { name: 'Pickaxe',      icon: 'pickaxe',      type: ItemType.Pickaxe },
    { name: 'Axe',          icon: 'axe',          type: ItemType.Axe },
    { name: 'Fishing Rod',  icon: 'fishingpole',  type: ItemType.FishingRod },
    { name: 'Fishing Bait', icon: 'fishingpole',  type: ItemType.FishingBait },
    { name: 'Scythe',       icon: 'scythe',       type: ItemType.Scythe },
    { name: 'Hunting Tool', icon: 'spear',        type: ItemType.HuntingTool }
  ];

  public armorSlots = [
    { name: 'Jewelry',      icon: 'ring',         type: ItemType.Jewelry },
    { name: 'Head',         icon: 'hat',          type: ItemType.HeadArmor },
    { name: 'Chest',        icon: 'shirt',        type: ItemType.ChestArmor },
    { name: 'Hands',        icon: 'gloves',       type: ItemType.HandArmor },
    { name: 'Legs',         icon: 'pants',        type: ItemType.LegArmor },
    { name: 'Feet',         icon: 'boots',        type: ItemType.FootArmor }
  ];

  constructor(private store: Store) { }

  ngOnInit() {
  }

  loadEquipment(slot: ItemType) {
    this.currentEquipSlot = slot;

    const items = this.store.selectSnapshot(CharSelectState.activeCharacterInventory);
    this.equippableItems = items.filter(item => item.type === slot);
  }

  equip(item: IGameItem) {
    this.currentEquipSlot = undefined;
    this.equippableItems = [];

    this.store.dispatch(new EquipItem(item));
  }

}
