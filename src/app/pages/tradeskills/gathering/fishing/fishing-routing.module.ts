import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FishingPage } from './fishing.page';

const routes: Routes = [
  {
    path: '',
    component: FishingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FishingPageRoutingModule {}
