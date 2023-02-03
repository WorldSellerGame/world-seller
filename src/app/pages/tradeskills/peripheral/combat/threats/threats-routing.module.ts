import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThreatsPage } from './threats.page';

const routes: Routes = [
  {
    path: '',
    component: ThreatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThreatsPageRoutingModule {}
