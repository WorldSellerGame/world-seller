import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CookingPageRoutingModule } from './cooking-routing.module';

import { SharedModule } from '../../../../shared.module';
import { CookingPage } from './cooking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CookingPageRoutingModule
  ],
  declarations: [CookingPage]
})
export class CookingPageModule {}
