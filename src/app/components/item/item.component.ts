import { Component, Input, OnInit } from '@angular/core';
import { IGameItem } from '../../../interfaces';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item!: IGameItem;

  constructor() { }

  ngOnInit() {}

}
