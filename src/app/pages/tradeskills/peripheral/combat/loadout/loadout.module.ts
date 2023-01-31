import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadoutPageRoutingModule } from './loadout-routing.module';

import { SharedModule } from '../../../../../shared.module';
import { LoadoutPage } from './loadout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LoadoutPageRoutingModule
  ],
  declarations: [LoadoutPage]
})
export class LoadoutPageModule {}
