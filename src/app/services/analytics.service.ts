import { Injectable } from '@angular/core';

import gameanalytics from 'gameanalytics';
import { environment } from '../../environments/environment';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private analytics: typeof gameanalytics.GameAnalytics;

  constructor(private metaService: MetaService) { }

  init() {
    this.analytics = gameanalytics.GameAnalytics;
    this.analytics.configureBuild(`${environment.platform} ${this.metaService.version}`);
    this.analytics.initialize(environment.gameanalytics.game, environment.gameanalytics.key);
  }

  sendDesignEvent(eventId: string, value: number = 0) {
    const eventIdOnlyText = eventId.replace(/[^a-zA-Z0-9:]/g, '');
    this.analytics.addDesignEvent(eventIdOnlyText, value);
  }
}
