import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-icon',
  templateUrl: './game-icon.component.html',
  styleUrls: ['./game-icon.component.scss'],
})
export class GameIconComponent implements OnInit {

  @Input() icon!: string;
  @Input() inlineIconSize = false;

  constructor() { }

  ngOnInit() {}

}
