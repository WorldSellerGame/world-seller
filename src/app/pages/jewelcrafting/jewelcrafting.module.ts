import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JewelcraftingPageRoutingModule } from './jewelcrafting-routing.module';

import { SharedModule } from '../../shared.module';
import { JewelcraftingPage } from './jewelcrafting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    JewelcraftingPageRoutingModule
  ],
  declarations: [JewelcraftingPage]
})
export class JewelcraftingPageModule {}
