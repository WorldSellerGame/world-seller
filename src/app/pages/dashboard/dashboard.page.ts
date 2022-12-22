import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { sortBy, uniq } from 'lodash';
import { Observable } from 'rxjs';
import { CharSelectState } from '../../../stores';

import * as resources from '../../../assets/content/resources.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;

  readonly resources = (resources as any).default || resources;

  constructor() { }

  ngOnInit() {
  }

  hasNoResources(resourceHash: Record<string, number>): boolean {
    return Object.keys(resourceHash).length === 0;
  }

  resourceCategories(resourceHash: Record<string, number>): string[] {
    return sortBy(uniq(Object.keys(resourceHash).map(x => this.resources[x].category)));
  }

  resourcesInCategory(resourceHash: Record<string, number>, category: string): string[] {
    return sortBy(Object.keys(resourceHash).filter(x => this.resources[x].category === category));
  }


}
