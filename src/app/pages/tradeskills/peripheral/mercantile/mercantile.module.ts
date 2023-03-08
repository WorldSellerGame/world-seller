import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MercantilePageRoutingModule } from './mercantile-routing.module';

import { MercantilePage } from './mercantile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MercantilePageRoutingModule
  ],
  declarations: [MercantilePage]
})
export class MercantilePageModule {}
