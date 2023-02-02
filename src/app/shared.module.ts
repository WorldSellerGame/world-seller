import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { IonicModule } from '@ionic/angular';
import { CombatFoodDisplayComponent } from './components/combat-food-display/combat-food-display.component';
import { CombatItemDisplayComponent } from './components/combat-item-display/combat-item-display.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { DebugActionMenuComponent } from './components/debug-action-menu/debug-action-menu.component';
import { GameIconComponent } from './components/game-icon/game-icon.component';
import { ItemIconComponent } from './components/item-icon/item-icon.component';
import { ItemComponent } from './components/item/item.component';
import { ResourceIconComponent } from './components/resource-icon/resource-icon.component';
import { SkillDisplayComponent } from './components/skill-display/skill-display.component';
import { StatLineComponent } from './components/stat-line/stat-line.component';
import { TimeResourceIconComponent } from './components/time-resource-icon/time-resource-icon.component';

@NgModule({
  declarations: [ResourceIconComponent, ItemIconComponent, TimeResourceIconComponent, CountdownComponent,
    GameIconComponent, ItemComponent, StatLineComponent, SkillDisplayComponent, DebugActionMenuComponent,
    CombatItemDisplayComponent, CombatFoodDisplayComponent],
  imports: [
    CommonModule,
    IonicModule,
    NgxTippyModule,
    AngularSvgIconModule
  ],
  exports: [ResourceIconComponent, ItemIconComponent, TimeResourceIconComponent, CountdownComponent,
    GameIconComponent, ItemComponent, StatLineComponent, SkillDisplayComponent, DebugActionMenuComponent,
    CombatItemDisplayComponent, CombatFoodDisplayComponent]
})
export class SharedModule { }
