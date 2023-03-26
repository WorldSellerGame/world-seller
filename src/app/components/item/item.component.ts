import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IGameItem } from '../../../interfaces';
import { getItemRarityClass } from '../../helpers';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit {

  @Input() item!: IGameItem;

  get itemClass() {
    return getItemRarityClass(this.item);
  }

  constructor() { }

  ngOnInit() {}

}
