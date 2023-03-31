import { Component, Input, OnInit } from '@angular/core';
import { IGameItem, Stat } from '../../../interfaces';
import { getStat } from '../../helpers';

@Component({
  selector: 'app-stat-line',
  templateUrl: './stat-line.component.html',
  styleUrls: ['./stat-line.component.scss'],
})
export class StatLineComponent implements OnInit {

  @Input() item!: IGameItem;
  @Input() withRespectTo!: IGameItem | undefined;

  constructor() { }

  ngOnInit() {}

  public allStats(): Stat[] {
    return Object.keys(this.item.stats || {}).filter(stat => getStat(this.item.stats, stat as Stat) !== 0) as Stat[];
  }

}
