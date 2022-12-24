import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryPageRoutingModule } from './inventory-routing.module';

import { SharedModule } from '../../shared.module';
import { InventoryPage } from './inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    InventoryPageRoutingModule
  ],
  declarations: [InventoryPage]
})
export class InventoryPageModule {}
