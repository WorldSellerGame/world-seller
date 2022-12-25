import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlchemyPage } from './alchemy.page';

const routes: Routes = [
  {
    path: '',
    component: AlchemyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlchemyPageRoutingModule {}
