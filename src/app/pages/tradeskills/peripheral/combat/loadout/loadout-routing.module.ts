import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadoutPage } from './loadout.page';

const routes: Routes = [
  {
    path: '',
    component: LoadoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadoutPageRoutingModule {}
