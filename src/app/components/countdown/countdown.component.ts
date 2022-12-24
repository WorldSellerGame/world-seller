import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit {

  @Input() duration = -1;

  public get hours() {
    return Math.floor(this.duration / 3600);
  }

  public get minutes() {
    return Math.floor((this.duration % 3600) / 60);
  }

  public get seconds() {
    return Math.floor((this.duration % 3600) % 60);
  }

  constructor() { }

  ngOnInit() {}

}
