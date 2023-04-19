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
  @Input() hideIcon = false;
  @Input() canClick = false;

  get itemClass() {
    return getItemRarityClass(this.item);
  }

  constructor() { }

  ngOnInit() {}

}
