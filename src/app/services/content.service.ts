import { Injectable } from '@angular/core';

import * as alchemy from '../../assets/content/alchemy.json';
import * as blacksmithing from '../../assets/content/blacksmithing.json';
import * as cooking from '../../assets/content/cooking.json';
import * as farming from '../../assets/content/farming.json';
import * as fishing from '../../assets/content/fishing.json';
import * as foraging from '../../assets/content/foraging.json';
import * as hunting from '../../assets/content/hunting.json';
import * as items from '../../assets/content/items.json';
import * as jewelcrafting from '../../assets/content/jewelcrafting.json';
import * as logging from '../../assets/content/logging.json';
import * as mining from '../../assets/content/mining.json';
import * as prospecting from '../../assets/content/prospecting.json';
import * as resources from '../../assets/content/resources.json';
import * as weaving from '../../assets/content/weaving.json';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  // core things
  public get resources() {
    return (resources as any).default || resources;
  }

  public get items() {
    return (items as any).default || items;
  }

  // other skills
  public get alchemy() {
    return (alchemy as any).default || alchemy;
  }

  public get blacksmithing() {
    return (blacksmithing as any).default || blacksmithing;
  }

  public get cooking() {
    return (cooking as any).default || cooking;
  }

  public get farming() {
    return (farming as any).default || farming;
  }

  public get fishing() {
    return (fishing as any).default || fishing;
  }

  public get foraging() {
    return (foraging as any).default || foraging;
  }

  public get hunting() {
    return (hunting as any).default || hunting;
  }

  public get jewelcrafting() {
    return (jewelcrafting as any).default || jewelcrafting;
  }

  public get logging() {
    return (logging as any).default || logging;
  }

  public get mining() {
    return (mining as any).default || mining;
  }

  public get prospecting() {
    return (prospecting as any).default || prospecting;
  }

  public get weaving() {
    return (weaving as any).default || weaving;
  }

  constructor() { }
}
