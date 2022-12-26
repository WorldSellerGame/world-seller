import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentPage } from './equipment.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentPageRoutingModule {}
