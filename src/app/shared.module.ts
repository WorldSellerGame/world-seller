import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CombatFoodDisplayComponent } from './components/combat-food-display/combat-food-display.component';
import { CombatItemDisplayComponent } from './components/combat-item-display/combat-item-display.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { DebugActionMenuComponent } from './components/debug-action-menu/debug-action-menu.component';
import { DebugTextComponent } from './components/debug-text/debug-text.component';
import { GameIconComponent } from './components/game-icon/game-icon.component';
import { GatheringPageDisplayComponent } from './components/gathering-page-display/gathering-page-display.component';
import { HeroComponent } from './components/hero/hero.component';
import { ItemIconComponent } from './components/item-icon/item-icon.component';
import { ItemTooltipComponent } from './components/item-tooltip/item-tooltip.component';
import { ItemComponent } from './components/item/item.component';
import { RealNameComponent } from './components/real-name/real-name.component';
import { RefiningPageDisplayComponent } from './components/refining-page-display/refining-page-display.component';
import { ResourceIconComponent } from './components/resource-icon/resource-icon.component';
import { ResourceTooltipComponent } from './components/resource-tooltip/resource-tooltip.component';
import { SkillDisplayComponent } from './components/skill-display/skill-display.component';
import { StatLineComponent } from './components/stat-line/stat-line.component';
import { StatNameDisplayComponent } from './components/stat-name-display/stat-name-display.component';
import { TimeResourceIconComponent } from './components/time-resource-icon/time-resource-icon.component';
import { AnalyticsClickDirective } from './directives/analytics-click.directive';
import { CloudLoginComponent } from './modals/cloud-login/cloud-login.component';
import { CloudManageComponent } from './modals/cloud-manage/cloud-manage.component';
import { ModioBrowseComponent } from './modals/modio-browse/modio-browse.component';
import { ModioPermissionComponent } from './modals/modio-permission/modio-permission.component';

const sharedComponents = [ResourceIconComponent, ItemIconComponent, TimeResourceIconComponent, CountdownComponent,
  GameIconComponent, ItemComponent, StatLineComponent, SkillDisplayComponent, DebugActionMenuComponent,
  CombatItemDisplayComponent, CombatFoodDisplayComponent, GatheringPageDisplayComponent, RefiningPageDisplayComponent,
  AnalyticsClickDirective, DebugTextComponent, ModioPermissionComponent, ModioBrowseComponent, StatNameDisplayComponent,
  HeroComponent, ItemTooltipComponent, ResourceTooltipComponent, RealNameComponent, CloudLoginComponent, CloudManageComponent];

@NgModule({
  declarations: sharedComponents,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxTippyModule,
    AngularSvgIconModule,
    ScrollingModule
  ],
  exports: sharedComponents
})
export class SharedModule { }
