import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sum } from 'lodash';
import { Observable, first } from 'rxjs';
import { IGameResource, IGameResourceTransform } from '../../../../../interfaces';
import { CharSelectState, ProspectingState } from '../../../../../stores';
import { ProspectRock } from '../../../../../stores/prospecting/prospecting.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';
import { ItemCreatorService } from '../../../../services/item-creator.service';

@Component({
  selector: 'app-prospecting',
  templateUrl: './prospecting.page.html',
  styleUrls: ['./prospecting.page.scss'],
})
export class ProspectingPage implements OnInit {

  public get locationData() {
    return this.contentService.getProspectingTransforms();
  }

  @Select(ProspectingState.level) level$!: Observable<number>;
  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;

  public prospectResources: Record<string, IGameResource> = {};
  public prospectTransformChances: Record<string, Record<string, string>> = {};

  constructor(private store: Store, private contentService: ContentService, private itemCreatorService: ItemCreatorService) { }

  ngOnInit() {
    this.level$.pipe(first()).subscribe(level => {
      const state = `Prospecting Lv.${level}, browsing...`;

      setDiscordStatus({
        state
      });
    });

    this.locationData.forEach((prospect: IGameResourceTransform) => {
      this.prospectTransformChances[prospect.startingItem] = {};
      this.prospectResources[prospect.startingItem] = this.contentService.getResourceByName(prospect.startingItem);

      const totalChance = sum(prospect.becomes.map(item => item.weight));

      prospect.becomes.forEach(item => {
        this.prospectTransformChances[prospect.startingItem][item.name] = (item.weight / totalChance * 100).toFixed(2);
      });
    });
  }

  trackBy(index: number) {
    return index;
  }

  iconForRecipe(transform: IGameResourceTransform) {
    return this.itemCreatorService.iconFor(transform.startingItem);
  }

  visibleProspects(skillLevel: number): IGameResourceTransform[] {
    return this.locationData.filter((prospect: IGameResourceTransform) => prospect.level.min <= skillLevel);
  }

  prospectItem(prospect: IGameResourceTransform) {
    this.store.dispatch(new ProspectRock(prospect, 1));
  }

}
