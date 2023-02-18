import { Directive, HostListener, Input } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';

@Directive({
  selector: '[analyticsClick]'
})
export class AnalyticsClickDirective {

  @Input() analyticsClick!: string;

  constructor(private analyticsService: AnalyticsService) { }

  @HostListener('click', ['$event'])
  click($event: any) {
    this.analyticsService.sendDesignEvent(this.analyticsClick, 1);
  }

}
