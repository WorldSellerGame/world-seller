import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangePage } from './exchange.page';

const routes: Routes = [
  {
    path: '',
    component: ExchangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangePageRoutingModule {}
