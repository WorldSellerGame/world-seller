import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { sortBy, uniq } from 'lodash';
import { Observable } from 'rxjs';
import { CharSelectState } from '../../../../stores';

import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
})
export class ResourcesPage implements OnInit {

  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
  }

  hasNoResources(resourceHash: Record<string, number>): boolean {
    return Object.keys(resourceHash).length === 0;
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
