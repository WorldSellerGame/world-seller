import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProspectingPageRoutingModule } from './prospecting-routing.module';

import { SharedModule } from '../../shared.module';
import { ProspectingPage } from './prospecting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ProspectingPageRoutingModule
  ],
  declarations: [ProspectingPage]
})
export class ProspectingPageModule {}
