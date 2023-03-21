import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { BlobReader, TextWriter } from '@zip.js/zip.js';
import { isArray, mergeWith } from 'lodash';
import { tap } from 'rxjs';

import { ZipReader } from '@zip.js/zip.js';
import { environment } from '../../environments/environment';
import { IGameModStored, IModReturnedData, IModSearchOptions } from '../../interfaces';
import { UpdateAllItems } from '../../stores/game/game.actions';
import { CacheMod, UncacheMod } from '../../stores/mods/mods.actions';
import { ModioBrowseComponent } from '../modals/modio-browse/modio-browse.component';
import { ModioPermissionComponent } from '../modals/modio-permission/modio-permission.component';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class ModsService {

  constructor(
    private store: Store,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private contentService: ContentService
  ) { }

  public async init() {
    await this.loadModsAtLaunch();
  }

  public async launchModManager() {
    const hasPermission = await this.checkPersistentPermission();

    if(!hasPermission) {
      const alert = await this.alertCtrl.create({
        header: 'Storage Permission',
        message: 'mod.io integration requires persistent storage permission. Hit OK to allow this and proceed, or cancel to back out.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'OK',
            handler: async () => {
              const gotPermission = await this.requestPersistentPermission();
              if(!gotPermission) {
                const warning = await this.alertCtrl.create({
                  header: 'Storage Permission Failed',
                  message: 'Permission was denied; you cannot use mods until you allow this permission.',
                  buttons: ['OK']
                });

                warning.present();
                return;
              }

              this.openAuthWindow();
            }
          }
        ]
      });

      alert.present();
      return;
    }

    this.openAuthWindow();
  }

  private async loadModsAtLaunch() {
    const mods = this.store.snapshot().mods?.mods || {};
    Object.values(mods).forEach(mod => {
      this.contentService.loadMod(mod as IGameModStored);
    });
  }

  private async requestPersistentPermission(): Promise<boolean> {
    if(!navigator.storage || !navigator.storage.persist) {
      return false;
    }

    const isPersisted = await navigator.storage.persist();
    return isPersisted;
  }

  private async checkPersistentPermission(): Promise<boolean> {
    if(!navigator.storage || !navigator.storage.persist) {
      return false;
    }

    const isPersisted = await navigator.storage.persisted();
    return isPersisted;
  }

  private isTokenValid(): boolean {
    const store = this.store.snapshot().mods || {};
    return store.modioAuthTokenExpires > Date.now();
  }

  private getToken(): string {
    const store = this.store.snapshot().mods || {};
    return store.modioAuthToken;
  }

  private async openAuthWindow(): Promise<void> {
    const isTokenValid = this.isTokenValid();
    if(isTokenValid) {
      this.openModManager();
      return;
    }

    const modal = await this.modalCtrl.create({
      component: ModioPermissionComponent,
      cssClass: 'modio-permissions'
    });

    await modal.present();
  }

  public async openModManager(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModioBrowseComponent,
      cssClass: 'modio-browse',
      backdropDismiss: false
    });

    await modal.present();
  }

  private getModioHeaders() {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${this.getToken()}`);

    return headers;
  }

  public requestCodeForEmail(email: string) {
    const body = new URLSearchParams();
    body.set('email', email);

    return this.http.post(
      `${environment.modio.url}/oauth/emailrequest?api_key=${environment.modio.apiKey}`,
      body.toString(),
      {
        headers: this.getModioHeaders()
      }
    );
  }

  public getAuthCodeForEmail(code: string) {
    const body = new URLSearchParams();
    body.set('security_code', code);
    body.set('date_expires', (Math.floor(Date.now() / 1000) + 31436000).toString());

    return this.http.post(
      `${environment.modio.url}/oauth/emailexchange?api_key=${environment.modio.apiKey}`,
      body.toString(),
      {
        headers: this.getModioHeaders()
      }
    );
  }

  public getBaseGameInfo() {
    return this.http.get(
      `${environment.modio.url}/games/${environment.modio.gameId}`,
      {
        params: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          api_key: environment.modio.apiKey
        },
        headers: this.getModioHeaders()
      }
    );
  }

  public getAllMods(searchOptions: IModSearchOptions = {}) {
    return this.http.get(
      `${environment.modio.url}/games/${environment.modio.gameId}/mods`,
      {
        params: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          api_key: environment.modio.apiKey,

          // eslint-disable-next-line @typescript-eslint/naming-convention
          'name-lk': searchOptions.query ? `*${searchOptions.query}*` : '',

          // eslint-disable-next-line @typescript-eslint/naming-convention
          _offset: (searchOptions.offset || 0).toString(),

          // eslint-disable-next-line @typescript-eslint/naming-convention
          _limit: (searchOptions.limit || 10).toString(),

          // eslint-disable-next-line @typescript-eslint/naming-convention
          _sort: searchOptions.sort || 'name',

          tags: (searchOptions.tags || []).join(',') || '',
        },
        headers: this.getModioHeaders()
      }
    );
  }

  public getMod(modId: number) {
    return this.http.get(
      `${environment.modio.url}/games/${environment.modio.gameId}/mods/${modId}`,
      {
        params: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          api_key: environment.modio.apiKey
        },
        headers: this.getModioHeaders()
      }
    );
  }

  public getMySubscriptions() {
    return this.http.get(
      `${environment.modio.url}/me/subscribed`,
      {
        headers: this.getModioHeaders()
      }
    );
  }

  public subscribeTo(modId: number) {
    return this.http.post(
      `${environment.modio.url}/games/${environment.modio.gameId}/mods/${modId}/subscribe`,
      '',
      {
        headers: this.getModioHeaders()
      }
    );
  }

  public unsubscribeFrom(modId: number) {
    return this.http.delete(
      `${environment.modio.url}/games/${environment.modio.gameId}/mods/${modId}/subscribe`,
      {
        headers: this.getModioHeaders()
      }
    );
  }

  public downloadAndCacheMod(mod: IModReturnedData) {
    return this.http.get(
      mod.modfile.download.binary_url,
      {
        responseType: 'arraybuffer'
      }
    ).pipe(
      tap(async (data) => {
        const zipBlob = new Blob([data]);
        const blobReader = new BlobReader(zipBlob);
        const zipReader = new ZipReader(blobReader);

        const zipEntries = await zipReader.getEntries();

        const customizer = (objValue: any, srcValue: any) => {
          if(isArray(objValue)) {
            return objValue.concat(srcValue);
          }

          return srcValue;
        };

        const modData = {};
        const icons: Array<{ name: string; data: string }> = [];
        const themes: Array<{ name: string; data: string }> = [];

        await Promise.all(zipEntries.map(async entry => {
          const reader = new TextWriter();
          const entryText = await entry.getData(reader);

          if(entry.filename.includes('.json')) {
            try {
              const parsedData = JSON.parse(entryText);
              mergeWith(modData, parsedData, customizer);
            } catch {
              console.error('Failed to parse mod data', entryText);
            }
          }

          if(entry.filename.includes('.svg')) {
            const filename = entry.filename?.split(/[\\/]/g)?.pop()?.split('.')[0];
            if(!filename) {
              return;
            }

            icons.push({
              name: filename,
              data: entryText
            });
          }

          if(entry.filename.includes('.css')) {
            const filename = entry.filename?.split(/[\\/]/g)?.pop()?.split('.')[0];
            if(!filename) {
              return;
            }

            themes.push({
              name: filename,
              data: entryText
            });
          }
        }));

        const savedMod: IGameModStored = { version: mod.modfile.version || '0.0.0', content: modData, icons, themes };
        this.contentService.loadMod(savedMod);
        this.store.dispatch(new CacheMod(mod.id, savedMod));

        await zipReader.close();
      })
    );

  }

  public deleteAndUncacheMod(mod: IModReturnedData) {
    const modData = this.store.snapshot().mods.mods[mod.id] || {};
    this.contentService.unloadMod(modData);
    this.store.dispatch([new UncacheMod(mod.id), new UpdateAllItems()]);
  }

}
