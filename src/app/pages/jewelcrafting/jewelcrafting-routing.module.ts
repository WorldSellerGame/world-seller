import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JewelcraftingPage } from './jewelcrafting.page';

const routes: Routes = [
  {
    path: '',
    component: JewelcraftingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JewelcraftingPageRoutingModule {}
