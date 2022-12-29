import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlacksmithPage } from './blacksmith.page';

const routes: Routes = [
  {
    path: '',
    component: BlacksmithPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlacksmithPageRoutingModule {}
