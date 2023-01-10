import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MercantileState, WorkersState } from '../../../../../stores';

@Component({
  selector: 'app-mercantile',
  templateUrl: './mercantile.page.html',
  styleUrls: ['./mercantile.page.scss'],
})
export class MercantilePage implements OnInit {

  @Select(MercantileState.shopCounterInfo) shopCounter$!: Observable<{ current: number; max: number }>;
  @Select(MercantileState.stockpileInfo) stockpileInfo$!: Observable<{ current: number; max: number }>;
  @Select(WorkersState.workersAndAllocated) workersAndAllocated$!: Observable<{ current: number; max: number }>;

  constructor() { }

  ngOnInit() {
  }

}
