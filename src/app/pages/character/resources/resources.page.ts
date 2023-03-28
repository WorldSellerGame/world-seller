import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { sortBy, uniq } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { CharSelectState } from '../../../../stores';

import { LocalStorage } from 'ngx-webstorage';
import { setDiscordStatus } from '../../../helpers/electron';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
})
export class ResourcesPage implements OnInit, OnDestroy {

  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;

  @LocalStorage('currenttab-resources') public activeCategory!: string;
  public categorySub!: Subscription;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
    this.activeCategory ??= '';

    setDiscordStatus({
      state: 'Browsing their stockpile...',
    });

    this.categorySub = this.resources$.subscribe(x => {
      if(this.activeCategory && this.resourcesInCategory(x, this.activeCategory).length > 0) {
        return;
      }

      if (this.hasNoResources(x)) {
        this.activeCategory = '';
      }

      this.activeCategory = this.resourceCategories(x)[0];
    });
  }

  ngOnDestroy() {
    this.categorySub?.unsubscribe();
  }

  trackBy(index: number) {
    return index;
  }

  hasNoResources(resourceHash: Record<string, number>): boolean {
    return Object.keys(resourceHash).length === 0;
  }

  changeCategory(category: string) {
    this.activeCategory = category;
  }

  resourceCategories(resourceHash: Record<string, number>): string[] {
    return sortBy(
      uniq(
        Object.keys(resourceHash)
          .filter(x => resourceHash[x] > 0)
          .map(x => this.contentService.getResourceByName(x)?.category)
      )
    );
  }

  resourcesInCategory(resourceHash: Record<string, number>, category: string): string[] {
    return sortBy(
      Object.keys(resourceHash)
        .filter(x => resourceHash[x] > 0)
        .filter(x => this.contentService.getResourceByName(x)?.category === category)
    );
  }


}
