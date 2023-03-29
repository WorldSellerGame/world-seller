import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { GameOption } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  private messageHistory: string[] = [];

  public get allMessages() {
    return this.messageHistory;
  }

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

  private logMessage(message: string) {
    this.messageHistory.push(message);

    while(this.messageHistory.length > 15) {
      this.messageHistory.shift();
    }
  }

  public notify(message: string) {
    this.logMessage(message);
    Notify.info(message, {
      ...this.notiflixDefaults()
    });
  }

  public error(message: string) {
    this.logMessage(message);
    Notify.failure(message, {
      ...this.notiflixDefaults()
    });
  }

  public warn(message: string) {
    this.logMessage(message);
    Notify.warning(message, {
      ...this.notiflixDefaults()
    });
  }

  public success(message: string) {
    this.logMessage(message);
    Notify.success(message, {
      ...this.notiflixDefaults()
    });
  }

  public achievement(message: string) {
    this.logMessage(message);
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
