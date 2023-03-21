import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IGameCombatAbilityEffect, IGameItem } from '../../../interfaces';
import { getItemRarityClass } from '../../helpers';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-combat-food-display',
  templateUrl: './combat-food-display.component.html',
  styleUrls: ['./combat-food-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CombatFoodDisplayComponent implements OnInit {

  @Input() item!: IGameItem;

  public effects: string[] = [];

  get itemClass() {
    return getItemRarityClass(this.item);
  }

  constructor(private contentService: ContentService) { }

  ngOnInit() {
    this.effects = (this.item.effects || [])
      .filter((x: IGameCombatAbilityEffect) => x.effect === 'ApplyEffect' && x.effectName)
      .map((effect: IGameCombatAbilityEffect) => this.contentService.getEffectByName(effect.effectName as string).name);
  }

}
