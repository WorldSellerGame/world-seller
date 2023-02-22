import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OptionsState } from '../../../stores';

@Component({
  selector: 'app-debug-text',
  templateUrl: './debug-text.component.html',
  styleUrls: ['./debug-text.component.scss'],
})
export class DebugTextComponent implements OnInit {

  @Select(OptionsState.isDebugMode) isDebugMode$!: Observable<boolean>;

  constructor() { }

  ngOnInit() {}

}
