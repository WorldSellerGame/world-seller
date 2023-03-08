import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockpilePageRoutingModule } from './stockpile-routing.module';

import { SharedModule } from '../../../../../shared.module';
import { StockpilePage } from './stockpile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    StockpilePageRoutingModule
  ],
  declarations: [StockpilePage]
})
export class StockpilePageModule {}
