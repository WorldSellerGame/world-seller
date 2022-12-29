import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiningPageRoutingModule } from './mining-routing.module';

import { SharedModule } from '../../../../shared.module';
import { MiningPage } from './mining.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MiningPageRoutingModule
  ],
  declarations: [MiningPage]
})
export class MiningPageModule {}
