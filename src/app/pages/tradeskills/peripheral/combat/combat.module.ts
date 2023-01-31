import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CombatPageRoutingModule } from './combat-routing.module';

import { SharedModule } from '../../../../shared.module';
import { CombatDisplayComponent } from './combat-display/combat-display.component';
import { CombatPage } from './combat.page';
import { DungeonDisplayComponent } from './dungeon-display/dungeon-display.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CombatPageRoutingModule
  ],
  declarations: [CombatPage, CombatDisplayComponent, DungeonDisplayComponent]
})
export class CombatPageModule {}
