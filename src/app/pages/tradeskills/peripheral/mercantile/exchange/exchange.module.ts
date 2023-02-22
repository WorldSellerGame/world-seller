import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExchangePageRoutingModule } from './exchange-routing.module';

import { SharedModule } from '../../../../../shared.module';
import { ExchangePage } from './exchange.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ExchangePageRoutingModule
  ],
  declarations: [ExchangePage]
})
export class ExchangePageModule {}
