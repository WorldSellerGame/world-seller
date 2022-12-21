import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { CountdownComponent } from './components/countdown/countdown.component';
import { ResourceIconComponent } from './components/resource-icon/resource-icon.component';

@NgModule({
  declarations: [ResourceIconComponent, CountdownComponent],
  imports: [
    CommonModule,
    AngularSvgIconModule
  ],
  exports: [ResourceIconComponent, CountdownComponent]
})
export class SharedModule { }
