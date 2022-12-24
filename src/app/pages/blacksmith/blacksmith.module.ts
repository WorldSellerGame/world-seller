import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlacksmithPageRoutingModule } from './blacksmith-routing.module';

import { SharedModule } from '../../shared.module';
import { BlacksmithPage } from './blacksmith.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    BlacksmithPageRoutingModule
  ],
  declarations: [BlacksmithPage]
})
export class BlacksmithPageModule {}
