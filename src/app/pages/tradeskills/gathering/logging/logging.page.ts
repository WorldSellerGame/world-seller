import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameGatherLocation } from '../../../../../interfaces';
import { LoggingState } from '../../../../../stores';
import { CancelLogging, SetLoggingLocation } from '../../../../../stores/logging/logging.actions';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.page.html',
  styleUrls: ['./logging.page.scss'],
})
export class LoggingPage implements OnInit {

  public get locationData() {
    return this.contentService.logging;
  }

  @Select(LoggingState.level) level$!: Observable<number>;
  @Select(LoggingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(LoggingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
  }

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 0) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  gather(location: IGameGatherLocation) {
    this.store.dispatch(new SetLoggingLocation(location));
  }

  cancelGather() {
    this.store.dispatch(new CancelLogging());
  }

}
