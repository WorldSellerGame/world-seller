import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DungeonsPageRoutingModule } from './dungeons-routing.module';

import { DungeonsPage } from './dungeons.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DungeonsPageRoutingModule
  ],
  declarations: [DungeonsPage]
})
export class DungeonsPageModule {}
