import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HuntingPage } from './hunting.page';

const routes: Routes = [
  {
    path: '',
    component: HuntingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HuntingPageRoutingModule {}
