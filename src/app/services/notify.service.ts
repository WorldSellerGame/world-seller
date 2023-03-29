import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { GameOption } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private store: Store, private alertCtrl: AlertController) { }

  private notificationPosition() {
    return this.store.selectSnapshot(state => state.options?.[GameOption.NotificationCorner]) ?? 'left-top';
  }

  private notiflixDefaults = () => ({
    fontSize: '15px',
    width: '400px',
    messageMaxLength: 300,
    timeout: 5000,
    useIcon: false,
    clickToClose: true,
    position: this.notificationPosition()
  });

  public notify(message: string) {
    Notify.info(message, {
      ...this.notiflixDefaults()
    });
  }

  public error(message: string) {
    Notify.failure(message, {
      ...this.notiflixDefaults()
    });
  }

  public warn(message: string) {
    Notify.warning(message, {
      ...this.notiflixDefaults()
    });
  }

  public success(message: string) {
    Notify.success(message, {
      ...this.notiflixDefaults()
    });
  }

  public achievement(message: string) {
    Notify.success(message, {
      ...this.notiflixDefaults(),
      className: 'notiflix-notify-achievement'
    });
  }

  public async confirm(header: string, message: string, buttons: any[] = []) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons
    });

    await alert.present();
  }
}
