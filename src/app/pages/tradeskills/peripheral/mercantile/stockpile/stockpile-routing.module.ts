import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockpilePage } from './stockpile.page';

const routes: Routes = [
  {
    path: '',
    component: StockpilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockpilePageRoutingModule {}
