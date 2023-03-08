import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-icon',
  templateUrl: './game-icon.component.html',
  styleUrls: ['./game-icon.component.scss'],
})
export class GameIconComponent implements OnInit {

  @Input() icon!: string;
  @Input() inlineIconSize = false;
  @Input() bigSize = false;
  @Input() color = '#fff';
  @Input() shimmer = false;

  public get size(): number {
    if (this.inlineIconSize) {
      return 24;
    }

    if (this.bigSize) {
      return 64;
    }

    return 32;
  }

  constructor() { }

  ngOnInit() {}

}
