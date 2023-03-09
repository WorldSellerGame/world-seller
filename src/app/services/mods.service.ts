import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ModsService {

  constructor(private alertCtrl: AlertController) { }

  public async init() {
    await this.loadMods();
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

  private async loadMods() {
    console.log('add a test mod and see if it works.');
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

  private async openAuthWindow(): Promise<void> {
  }

}
