import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmingPage } from './farming.page';

const routes: Routes = [
  {
    path: '',
    component: FarmingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmingPageRoutingModule {}
