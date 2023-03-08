import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FishingPageRoutingModule } from './fishing-routing.module';

import { SharedModule } from '../../../../shared.module';
import { FishingPage } from './fishing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    FishingPageRoutingModule
  ],
  declarations: [FishingPage]
})
export class FishingPageModule {}
