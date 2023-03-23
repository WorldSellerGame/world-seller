import { Component, Input, OnInit } from '@angular/core';
import { IGameItem, Stat } from '../../../interfaces';

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
    return Object.keys(this.item.stats || {}).filter(stat => this.item.stats[stat as Stat] > 0) as Stat[];
  }

}
