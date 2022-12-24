import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { CountdownComponent } from './components/countdown/countdown.component';
import { GameIconComponent } from './components/game-icon/game-icon.component';
import { ItemComponent } from './components/item/item.component';
import { ResourceIconComponent } from './components/resource-icon/resource-icon.component';
import { TimeResourceIconComponent } from './components/time-resource-icon/time-resource-icon.component';

@NgModule({
  declarations: [ResourceIconComponent, TimeResourceIconComponent, CountdownComponent, GameIconComponent, ItemComponent],
  imports: [
    CommonModule,
    AngularSvgIconModule
  ],
  exports: [ResourceIconComponent, TimeResourceIconComponent, CountdownComponent, GameIconComponent, ItemComponent]
})
export class SharedModule { }
