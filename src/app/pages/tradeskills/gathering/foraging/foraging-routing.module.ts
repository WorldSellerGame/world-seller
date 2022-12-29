import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForagingPage } from './foraging.page';

const routes: Routes = [
  {
    path: '',
    component: ForagingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForagingPageRoutingModule {}
