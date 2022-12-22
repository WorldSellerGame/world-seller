import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoggingPageRoutingModule } from './logging-routing.module';

import { SharedModule } from '../../shared.module';
import { LoggingPage } from './logging.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LoggingPageRoutingModule
  ],
  declarations: [LoggingPage]
})
export class LoggingPageModule {}
