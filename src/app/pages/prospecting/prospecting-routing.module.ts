import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProspectingPage } from './prospecting.page';

const routes: Routes = [
  {
    path: '',
    component: ProspectingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProspectingPageRoutingModule {}
