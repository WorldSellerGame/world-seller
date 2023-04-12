import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { IPlayerCharacter } from '../../interfaces';
import { CharSelectState } from '../../stores';
import { ToggleCharacterCloud } from '../../stores/charselect/charselect.actions';
import { CloudLoginComponent } from '../modals/cloud-login/cloud-login.component';
import { CloudManageComponent } from '../modals/cloud-manage/cloud-manage.component';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root'
})
export class CloudSaveService {

  private nextSaveDate = 0;

  private savefileHeaders!: AngularFirestoreCollection<any>;
  private savefiles!: AngularFirestoreCollection<any>;

  constructor(
    private store: Store,
    private modalCtrl: ModalController,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private metaService: MetaService
  ) { }

  async init() {
    this.savefileHeaders = this.firestore.collection('savefileHeaders');
    this.savefiles = this.firestore.collection('savefiles');
    this.loadCurrentSavefile();
  }

  public async openLogin(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CloudLoginComponent,
      cssClass: 'cloud-login',
      backdropDismiss: false
    });

    await modal.present();
  }

  public async openManage(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CloudManageComponent,
      cssClass: 'cloud-manage',
      backdropDismiss: false
    });

    await modal.present();
  }

  async register(email: string, password: string) {
    await this.auth.setPersistence('local');
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  async login(email: string, password: string) {
    await this.auth.setPersistence('local');
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    return this.auth.signOut();
  }

  async allSavefiles() {
    const userId = this.getUserId();
    if (!userId) {
      return of([]);
    }

    const savefiles = await this.firestore.collection(`savefileHeaders/${userId}/characters`).valueChanges();
    return savefiles;
  }

  async loadCurrentSavefile() {
    const { charId, saveData } = this.metaService.characterSavefile();
    const myCurrentCharacter: IPlayerCharacter = saveData.charselect.characters[saveData.charselect.currentCharacter];

    const userId = this.getUserId();
    if (!userId) {
      return;
    }

    const savefile = await this.getSavefile(charId);
    savefile.subscribe(save => {
      if(!save) {
        this.store.dispatch(new ToggleCharacterCloud(saveData.charselect.currentCharacter, false));
        return;
      }

      const savefileData = save.data();
      console.log(savefileData);
      if(!savefileData) {
        this.store.dispatch(new ToggleCharacterCloud(saveData.charselect.currentCharacter, false));
        return;
      }

      const savefileLevel = savefileData.charselect.characters[savefileData.charselect.currentCharacter]?.lastTotalLevel ?? 0;
      const myCurrentLevel = myCurrentCharacter?.lastTotalLevel ?? 0;
      if(!savefileLevel) {
        return;
      }

      if(savefileLevel <= myCurrentLevel) {
        return;
      }

      this.metaService.importCharacter(savefileData);
    });
  }

  // TODO: make sure when loading the app, if a character iscloud = true, but the character does not exist in the cloud, remove iscloud = true
  async getSavefile(charId: string): Promise<Observable<any>> {
    const userId = this.getUserId();
    if (!userId) {
      return of(undefined);
    }

    const savefile = await this.savefiles.doc(`${userId}/characters/${charId}`).get();
    return savefile;
  }

  async loadSavefile(charId: string) {
    const savefile = await this.getSavefile(charId);
    savefile.subscribe(save => {
      if(!save) {
        return;
      }

      const savefileData = save.data();
      this.metaService.importCharacter(savefileData);
    });
  }

  async saveSavefile(slot = 0, isManual = false) {
    if(Date.now() < this.nextSaveDate && !isManual) {
      return;
    }

    const userId = this.getUserId();
    if (!userId) {
      return;
    }

    const character = this.store.selectSnapshot(CharSelectState.characters)[0];
    if(!character.isCloud) {
      return;
    }

    const { charId, charName, saveData } = this.metaService.characterSavefile(slot);

    let didSave = false;

    const currentSavefile = await this.savefileHeaders.doc(`${userId}/characters/${charId}`).get();
    currentSavefile.subscribe(async save => {
      const savefileData = save.data();
      if(!savefileData) {
        return;
      }

      if(savefileData.lastTotalLevel > character.lastTotalLevel) {
        return;
      }

      await this.savefileHeaders.doc(`${userId}/characters/${charId}`).set({
        charId,
        charName,
        lastSavedAt: character.lastSavedAt,
        lastTotalLevel: character.lastTotalLevel
      });

      await this.savefiles.doc(`${userId}/characters/${charId}`).set(saveData);

      didSave = true;
    });

    if(didSave && !isManual) {
      this.nextSaveDate = Date.now() + 30000;
    }
  }

  async deleteLocalSavefileFromCloud(slot = 0) {
    const userId = this.getUserId();
    if (!userId) {
      return;
    }

    const { charId } = this.metaService.characterSavefile(slot);
    await this.savefileHeaders.doc(`${userId}/characters/${charId}`).delete();
    await this.savefiles.doc(`${userId}/characters/${charId}`).delete();
  }

  async deleteCloudSavefile(charId: string) {
    const userId = this.getUserId();
    if (!userId) {
      return;
    }

    await this.savefileHeaders.doc(`${userId}/characters/${charId}`).delete();
    await this.savefiles.doc(`${userId}/characters/${charId}`).delete();
  }

  private getUserId(): string {
    return this.store.snapshot().game.firebaseUID;
  }
}
