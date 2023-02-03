import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DungeonsPage } from './dungeons.page';

const routes: Routes = [
  {
    path: '',
    component: DungeonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DungeonsPageRoutingModule {}
