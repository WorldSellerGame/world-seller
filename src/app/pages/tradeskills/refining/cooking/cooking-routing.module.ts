import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CookingPage } from './cooking.page';

const routes: Routes = [
  {
    path: '',
    component: CookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CookingPageRoutingModule {}
