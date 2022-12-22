import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import * as locationData from '../../../assets/content/logging.json';
import { IGameGatherLocation } from '../../../interfaces';
import { LoggingState } from '../../../stores';
import { CancelLogging, SetLoggingLocation } from '../../../stores/logging/logging.actions';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.page.html',
  styleUrls: ['./logging.page.scss'],
})
export class LoggingPage implements OnInit {

  public readonly locationData = (locationData as any).default || locationData;

  @Select(LoggingState.level) level$!: Observable<number>;
  @Select(LoggingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 1) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  gather(location: IGameGatherLocation) {
    this.store.dispatch(new SetLoggingLocation(location));
  }

  cancelGather() {
    this.store.dispatch(new CancelLogging());
  }

}
