import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private alertCtrl: AlertController) { }

  public notify(message: string) {
    Notify.info(message, {
      useIcon: false,
      clickToClose: true,
      fontSize: '15px',
      width: '400px',
      messageMaxLength: 300,
      timeout: 5000
    });
  }

  public error(message: string) {
    Notify.failure(message, {
      useIcon: false,
      clickToClose: true,
      fontSize: '15px',
      width: '400px',
      messageMaxLength: 300,
      timeout: 5000
    });
  }

  public warn(message: string) {
    Notify.warning(message, {
      useIcon: false,
      clickToClose: true,
      fontSize: '15px',
      width: '400px',
      messageMaxLength: 300,
      timeout: 5000
    });
  }

  public success(message: string) {
    Notify.success(message, {
      useIcon: false,
      clickToClose: true,
      fontSize: '15px',
      width: '400px',
      messageMaxLength: 300,
      timeout: 5000
    });
  }

  public achievement(message: string) {
    Notify.success(message, {
      useIcon: false,
      clickToClose: true,
      fontSize: '15px',
      timeout: 5000,
      width: '400px',
      messageMaxLength: 300,
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
