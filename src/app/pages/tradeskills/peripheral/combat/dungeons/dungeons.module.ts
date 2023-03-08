import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DungeonsPageRoutingModule } from './dungeons-routing.module';

import { SharedModule } from '../../../../../shared.module';
import { DungeonsPage } from './dungeons.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DungeonsPageRoutingModule
  ],
  declarations: [DungeonsPage]
})
export class DungeonsPageModule {}
