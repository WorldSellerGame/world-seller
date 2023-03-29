import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { IGameItem } from '../../../../../../interfaces';
import { CharSelectState, CombatState } from '../../../../../../stores';
import { SetFood, SetItem, SetSkill } from '../../../../../../stores/combat/combat.actions';
import { getSkillsFromItems } from '../../../../../helpers';
import { CharacterInfoService } from '../../../../../services/character-info.service';

@Component({
  selector: 'app-loadout',
  templateUrl: './loadout.page.html',
  styleUrls: ['./loadout.page.scss'],
})
export class LoadoutPage implements OnInit, OnDestroy {

  @Select(CombatState.activeSkills) activeSkills$!: Observable<string[]>;
  @Select(CombatState.activeItems) activeItems$!: Observable<IGameItem[]>;
  @Select(CombatState.activeFoods) activeFoods$!: Observable<IGameItem[]>;
  @Select(CharSelectState.activeCharacterInventory) inventory$!: Observable<IGameItem[]>;
  @Select(CharSelectState.activeCharacterEquipment) equipment$!: Observable<Record<string, IGameItem>>;

  public level!: Subscription;
  public allUsableItems!: Subscription;

  public readonly skills = [0, 1, 2, 3, 4];
  public readonly items = [0, 1, 2];
  public readonly foods = [0];

  public usableFoods: IGameItem[] = [];
  public usableItems: IGameItem[] = [];

  public get learnedSkills() {
    return this.charInfo.skills;
  }

  public selectedItemLoadoutIndex = -1;
  public selectedAbilityLoadoutIndex = -1;
  public selectedFoodLoadoutIndex = -1;

  constructor(private store: Store, private charInfo: CharacterInfoService) { }

  ngOnInit() {
    this.allUsableItems = this.inventory$.subscribe(items => {
      const checkItems = items || [];
      this.usableItems = checkItems.filter(item => (item.abilities?.length ?? 0) > 0);
      this.usableFoods = checkItems.filter(item => (item.foodDuration ?? 0) > 0);
    });
  }

  ngOnDestroy() {
    this.level?.unsubscribe();
    this.allUsableItems?.unsubscribe();
  }

  trackBy(index: number) {
    return index;
  }

  getItemSkills(items: Record<string, IGameItem>): string[] {
    return getSkillsFromItems(items);
  }

  selectSkillIndex(index: number) {
    this.selectedItemLoadoutIndex = -1;
    this.selectedFoodLoadoutIndex = -1;

    if(this.selectedAbilityLoadoutIndex === index) {
      this.selectedAbilityLoadoutIndex = -1;
      return;
    }

    this.selectedAbilityLoadoutIndex = index;
  }

  slotSkill(skillName: string, index: number) {
    this.store.dispatch(new SetSkill(skillName, index));

    setTimeout(() => {
      this.selectedAbilityLoadoutIndex = -1;
    }, 0);
  }

  unslotSkill(index: number) {
    this.slotSkill('', index);
  }

  selectItemIndex(index: number) {
    this.selectedAbilityLoadoutIndex = -1;
    this.selectedFoodLoadoutIndex = -1;

    if(this.selectedItemLoadoutIndex === index) {
      this.selectedItemLoadoutIndex = -1;
      return;
    }

    this.selectedItemLoadoutIndex = index;
  }

  slotItem(item: IGameItem | undefined, index: number) {
    this.store.dispatch(new SetItem(item, index));

    setTimeout(() => {
      this.selectedItemLoadoutIndex = -1;
    }, 0);
  }

  unslotItem(index: number) {
    this.slotItem(undefined, index);
  }

  selectFoodIndex(index: number) {
    this.selectedAbilityLoadoutIndex = -1;
    this.selectedItemLoadoutIndex = -1;

    if(this.selectedFoodLoadoutIndex === index) {
      this.selectedFoodLoadoutIndex = -1;
      return;
    }

    this.selectedFoodLoadoutIndex = index;
  }

  slotFood(item: IGameItem | undefined, index: number) {
    this.store.dispatch(new SetFood(item, index));

    setTimeout(() => {
      this.selectedFoodLoadoutIndex = -1;
    }, 0);
  }

  unslotFood(index: number) {
    this.slotFood(undefined, index);
  }

}
