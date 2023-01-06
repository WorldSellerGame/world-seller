import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkersPageRoutingModule } from './workers-routing.module';

import { WorkersPage } from './workers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkersPageRoutingModule
  ],
  declarations: [WorkersPage]
})
export class WorkersPageModule {}
