import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IGameCombatAbility, IGameItem } from '../../../interfaces';
import { getItemRarityClass } from '../../helpers';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-combat-item-display',
  templateUrl: './combat-item-display.component.html',
  styleUrls: ['./combat-item-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CombatItemDisplayComponent implements OnInit {

  @Input() item!: IGameItem;
  @Input() showEffectInfo = false;
  @Input() showUses = true;

  get itemClass() {
    return getItemRarityClass(this.item);
  }

  constructor(private contentService: ContentService) { }

  ngOnInit() {}

  getAbility(name: string): IGameCombatAbility {
    return this.contentService.getAbilityByName(name) || '';
  }

  trackBy(index: number) {
    return index;
  }

}
