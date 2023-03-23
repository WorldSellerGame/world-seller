/* eslint-disable @typescript-eslint/naming-convention */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IGameModStored, IModReturnedData, IModReturnedValue } from '../../../interfaces';
import { ModsState } from '../../../stores';
import { CacheMod, UncacheMod } from '../../../stores/mods/mods.actions';
import { ContentService } from '../../services/content.service';
import { ModsService } from '../../services/mods.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-modio-browse',
  templateUrl: './modio-browse.component.html',
  styleUrls: ['./modio-browse.component.scss'],
})
export class ModioBrowseComponent implements OnInit, OnDestroy {

  @Select(ModsState.mods) mods$!: Observable<Record<number, IGameModStored>>;
  @Select(ModsState.localMods) localMods$!: Observable<Array<string | number>>;

  private modSub!: Subscription;
  public storedModData: Record<number | string, IGameModStored> = {};

  public searchQuery = '';
  public selectedTags: Record<string, boolean> = {};
  public sort = 'popular';
  public mySubscriptions = false;

  public totalMods = 0;
  public tags: string[] = [];
  public currentPage = 0;
  public sorts = [
    { name: 'Name A-Z',           value: 'name' },
    { name: 'Most Popular',       value: 'popular' },
    { name: 'Most Downloads',     value: 'downloads' },
    { name: 'Highest Rated',      value: 'rating' },
    { name: 'Most Subscribers',   value: 'subscribers' },

    { name: 'Name Z-A',           value: '-name' },
    { name: 'Least Popular',      value: '-popular' },
    { name: 'Least Downloads',    value: '-downloads' },
    { name: 'Lowest Rated',       value: '-rating' },
    { name: 'Least Subscribers',  value: '-subscribers' },
  ];

  public activeMod: IModReturnedData | undefined = undefined;

  public modsInfo: IModReturnedValue = {
    data: [],
    result_count: 0,
    result_limit: 0,
    result_offset: 0,
    result_total: 0
  };

  public subscriptionsInfo: IModReturnedValue = {
    data: [],
    result_count: 0,
    result_limit: 0,
    result_offset: 0,
    result_total: 0
  };

  public get currentModList(): IModReturnedValue {
    return this.mySubscriptions ? this.subscriptionsInfo : this.modsInfo;
  }

  public subscriptionHash: Record<number, boolean> = {};

  public readonly maxMods = 100;

  public get canSubscribe(): boolean {
    return this.subscriptionsInfo.result_count < this.maxMods;
  }

  public get modioLink() {
    return environment.modio.modsUrl;
  }

  public get anyModsNeedUpdates(): boolean {
    return this.subscriptionsInfo.data.some(mod => !this.versionMatches(mod));
  }

  constructor(
    private store: Store,
    public modal: ModalController,
    private modsService: ModsService,
    private contentService: ContentService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.modSub = this.mods$.subscribe(mods => {
      this.storedModData = mods;
    });

    this.modsService.getBaseGameInfo().subscribe((data: any) => {
      this.totalMods = data.stats.mods_count_total;
      const allOptions = data.tag_options.map((options: any) => options.tags).flat();
      this.tags = [...new Set(allOptions)].sort() as string[];
    });

    this.search();
    this.loadSubscribed();
  }

  ngOnDestroy() {
    this.modSub?.unsubscribe();
  }

  trackBy(index: number) {
    return index;
  }

  versionMatches(mod: IModReturnedData) {
    return mod.modfile.version === this.storedModData[mod.id]?.version;
  }

  showModInfo(mod: IModReturnedData) {
    this.modsService.getMod(mod.id).subscribe((data) => {
      this.activeMod = data as IModReturnedData;
    });
  }

  changeSomethingThenSearch() {
    this.currentPage = 0;
    this.search();
  }

  toggleSubscriptions() {
    this.currentPage = 0;
    this.mySubscriptions = !this.mySubscriptions;
    this.search();
  }

  search() {
    this.modsService.getAllMods({
      query: this.searchQuery,
      tags: Object.keys(this.selectedTags).filter((tag) => this.selectedTags[tag]),
      limit: 10,
      offset: this.currentPage * 10
    }).subscribe((mods: any) => {
      this.modsInfo = mods;
    });
  }

  loadSubscribed() {
    this.modsService.getMySubscriptions().subscribe((mods) => {
      this.subscriptionsInfo = mods as IModReturnedValue;

      this.subscriptionHash = {};
      this.subscriptionsInfo.data.forEach(mod => {
        this.subscriptionHash[mod.id] = true;
      });
    });
  }

  previousPage() {
    this.currentPage--;
    this.search();
  }

  nextPage() {
    this.currentPage++;
    this.search();
  }

  subscribeToMod(mod: IModReturnedData) {
    if(!this.canSubscribe) {
      return;
    }

    if(Date.now() > mod.modfile.download.date_expires * 1000) {
      this.notify.error('The download for this mod has expired. Please reload the game and try again.');
      return;
    }

    this.modsService.subscribeTo(mod.id).subscribe(() => {
      this.loadSubscribed();
      this.modsService.downloadAndCacheMod(mod).subscribe(() => {
        this.notify.success(`Subscribed to mod "${mod.name}"!`);
      });
    });
  }

  unsubscribeFromMod(mod: IModReturnedData) {
    this.modsService.unsubscribeFrom(mod.id).subscribe(() => {
      this.loadSubscribed();
      this.modsService.deleteAndUncacheMod(mod);
      this.notify.success(`Unsubscribed from mod "${mod.name}"!`);
    });
  }

  updateMod(mod: IModReturnedData) {
    this.modsService.downloadAndCacheMod(mod).subscribe(() => {
      this.notify.success(`Updated mod "${mod.name}"!`);
    });
  }

  updateAllMods() {
    this.subscriptionsInfo.data.forEach(mod => {
      if(this.versionMatches(mod)) {
        return;
      }

      this.updateMod(mod);
    });
  }

  importTestMod(e: any, inputEl: HTMLInputElement) {
    if (!e || !e.target || !e.target.files) {
      return;
    }

    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const zipFile = (ev.target as FileReader).result as ArrayBuffer;

      const finish = () => {
        inputEl.value = '';
      };

      const { modData, icons, themes, sounds } = await this.modsService.getModDataFromZipData(zipFile);

      const localMod: IGameModStored = {
        version: 'LOCAL',
        content: modData,
        icons, themes,
        name: file.name,
        sounds,
        id: `LOCAL-${file.name}`
      };

      this.contentService.loadMod(localMod);
      this.store.dispatch(new CacheMod(localMod.id, localMod, true));

      finish();
    };

    reader.readAsArrayBuffer(file);
  }

  removeTestMod(mod: IGameModStored) {
    const existingMod = this.store.snapshot().mods.mods[mod.id];
    this.contentService.unloadMod(existingMod);
    this.store.dispatch(new UncacheMod(mod.id));
  }

}
