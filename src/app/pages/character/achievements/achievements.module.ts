import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AchievementsPageRoutingModule } from './achievements-routing.module';

import { SharedModule } from '../../../shared.module';
import { AchievementsPage } from './achievements.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AchievementsPageRoutingModule
  ],
  declarations: [AchievementsPage]
})
export class AchievementsPageModule {}
