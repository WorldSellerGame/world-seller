import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FarmingPageRoutingModule } from './farming-routing.module';

import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { SharedModule } from '../../../../shared.module';
import { FarmingPage } from './farming.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NgxTippyModule,
    FarmingPageRoutingModule
  ],
  declarations: [FarmingPage]
})
export class FarmingPageModule {}
