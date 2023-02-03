import { Component, Input, OnInit } from '@angular/core';
import { IGameItem } from '../../../interfaces';
import { getItemRarityClass } from '../../helpers';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-combat-food-display',
  templateUrl: './combat-food-display.component.html',
  styleUrls: ['./combat-food-display.component.scss'],
})
export class CombatFoodDisplayComponent implements OnInit {

  @Input() item!: IGameItem;

  get itemClass() {
    return getItemRarityClass(this.item);
  }

  constructor(private contentService: ContentService) { }

  ngOnInit() {}

}
