import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkersPage } from './workers.page';

const routes: Routes = [
  {
    path: '',
    component: WorkersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkersPageRoutingModule {}
