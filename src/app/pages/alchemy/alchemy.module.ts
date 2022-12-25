import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlchemyPageRoutingModule } from './alchemy-routing.module';

import { SharedModule } from '../../shared.module';
import { AlchemyPage } from './alchemy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AlchemyPageRoutingModule
  ],
  declarations: [AlchemyPage]
})
export class AlchemyPageModule {}
