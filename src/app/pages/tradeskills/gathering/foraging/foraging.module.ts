import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForagingPageRoutingModule } from './foraging-routing.module';

import { SharedModule } from '../../../../shared.module';
import { ForagingPage } from './foraging.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ForagingPageRoutingModule
  ],
  declarations: [ForagingPage]
})
export class ForagingPageModule {}
