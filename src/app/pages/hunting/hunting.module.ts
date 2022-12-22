import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HuntingPageRoutingModule } from './hunting-routing.module';

import { SharedModule } from '../../shared.module';
import { HuntingPage } from './hunting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    HuntingPageRoutingModule
  ],
  declarations: [HuntingPage]
})
export class HuntingPageModule {}
