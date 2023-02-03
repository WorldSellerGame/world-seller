import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThreatsPageRoutingModule } from './threats-routing.module';

import { SharedModule } from '../../../../../shared.module';
import { ThreatsPage } from './threats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ThreatsPageRoutingModule
  ],
  declarations: [ThreatsPage]
})
export class ThreatsPageModule {}
