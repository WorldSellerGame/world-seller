import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkersPageRoutingModule } from './workers-routing.module';

import { SharedModule } from '../../../../../shared.module';
import { WorkersPage } from './workers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    WorkersPageRoutingModule
  ],
  declarations: [WorkersPage]
})
export class WorkersPageModule {}
