import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-resource-icon',
  templateUrl: './time-resource-icon.component.html',
  styleUrls: ['./time-resource-icon.component.scss'],
})
export class TimeResourceIconComponent implements OnInit {

  @Input() time = 1;
  @Input() inlineIconSize = false;
  @Input() emphasizeText = true;

  constructor() { }

  ngOnInit() {}

}
