import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameResourceTransform } from '../../../../../interfaces';
import { CharSelectState, ProspectingState } from '../../../../../stores';
import { ProspectRock } from '../../../../../stores/prospecting/prospecting.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-prospecting',
  templateUrl: './prospecting.page.html',
  styleUrls: ['./prospecting.page.scss'],
})
export class ProspectingPage implements OnInit {

  public get locationData() {
    return this.contentService.prospecting;
  }

  @Select(ProspectingState.level) level$!: Observable<number>;
  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
    this.level$.pipe(first()).subscribe(level => {
      const state = `Prospecting Lv.${level}, browsing...`;

      setDiscordStatus({
        state
      });
    });
  }

  trackBy(index: number) {
    return index;
  }

  visibleProspects(skillLevel: number): IGameResourceTransform[] {
    return this.locationData.transforms.filter((prospect: IGameResourceTransform) => prospect.level.min <= skillLevel);
  }

  prospectItem(prospect: IGameResourceTransform) {
    this.store.dispatch(new ProspectRock(prospect, 1));
  }

}
