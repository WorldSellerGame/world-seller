import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CollectionReference, Firestore, collection } from '@angular/fire/firestore';
import { Store } from '@ngxs/store';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root'
})
export class CloudSaveService {

  private savefileRef!: CollectionReference<any>;

  constructor(
    private store: Store,
    private auth: AngularFireAuth,
    private firestore: Firestore,
    private metaService: MetaService
  ) { }

  async init() {
    this.savefileRef = collection(this.firestore, '/savefiles');

    this.loadSavefile();
    console.log(this.firestore, this.auth);
  }

  async login(email: string, password: string) {
    const res = await this.auth.signInWithEmailAndPassword(email, password);

    console.log(res);
    // firebase add credentials
    // on success, saveSavefile()
  }

  async logout() {
    // kill firebase credentials
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
