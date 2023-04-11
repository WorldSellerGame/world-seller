import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CollectionReference, Firestore, collection } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { CloudLoginComponent } from '../modals/cloud-login/cloud-login.component';
import { CloudManageComponent } from '../modals/cloud-manage/cloud-manage.component';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root'
})
export class CloudSaveService {

  private savefileRef!: CollectionReference<any>;

  constructor(
    private store: Store,
    private modalCtrl: ModalController,
    private auth: AngularFireAuth,
    private firestore: Firestore,
    private metaService: MetaService
  ) { }

  async init() {
    this.savefileRef = collection(this.firestore, '/savefiles');

    this.loadSavefile();
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
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  async login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    return this.auth.signOut();
  }

  async loadSavefile() {
    // check if auth credentials
    //  - none, bail
    // load from firestore
    // metaService.importCharacter
  }

  async saveSavefile() {
    const { charName, saveData } = this.metaService.characterSavefile();
    console.log({ charName, saveData });

    // export to firebase
  }
}
