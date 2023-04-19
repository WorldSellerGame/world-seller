import { Directive, HostListener, Input } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';

@Directive({
  selector: '[analyticsClick]'
})
export class AnalyticsClickDirective {

  @Input() analyticsClick!: string;
  @Input() analyticsClickValue = 1;

  constructor(private analyticsService: AnalyticsService) { }

  @HostListener('click', ['$event'])
  click($event: any) {
    this.analyticsService.sendDesignEvent(this.analyticsClick, this.analyticsClickValue);
  }

}
