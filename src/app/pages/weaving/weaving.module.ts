import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeavingPageRoutingModule } from './weaving-routing.module';

import { SharedModule } from '../../shared.module';
import { WeavingPage } from './weaving.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    WeavingPageRoutingModule
  ],
  declarations: [WeavingPage]
})
export class WeavingPageModule {}
