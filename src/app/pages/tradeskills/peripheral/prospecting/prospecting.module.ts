import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProspectingPageRoutingModule } from './prospecting-routing.module';

import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { SharedModule } from '../../../../shared.module';
import { ProspectingPage } from './prospecting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NgxTippyModule,
    ProspectingPageRoutingModule
  ],
  declarations: [ProspectingPage]
})
export class ProspectingPageModule {}
