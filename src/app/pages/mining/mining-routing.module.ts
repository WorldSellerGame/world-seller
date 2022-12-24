import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiningPage } from './mining.page';

const routes: Routes = [
  {
    path: '',
    component: MiningPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiningPageRoutingModule {}
