import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Observable, Subject, timer } from 'rxjs';
import { GameOption, Tradeskill } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  private tradeskillEmits = new Subject<{ tradeskill: string; message: string }>();
  public tradeskill$: Observable<{ tradeskill: string; message: string }> = this.tradeskillEmits.asObservable();

  private nextTradeskillMessages: Record<Tradeskill, string[]> = {
    fishing: [],
    foraging: [],
    hunting: [],
    logging: [],
    mining: [],

    alchemy: [],
    blacksmithing: [],
    cooking: [],
    jewelcrafting: [],
    weaving: [],

    combat: [],
    farming: [],
    mercantile: [],
    prospecting: []
  };

  private messageHistory: string[] = [];

  public get allMessages() {
    return this.messageHistory;
  }

  constructor(private store: Store, private alertCtrl: AlertController) {
    this.init();
  }

  private init() {
    timer(0, 500).subscribe(() => {
      Object.keys(this.nextTradeskillMessages).forEach(tradeskill => {
        const messages = this.nextTradeskillMessages[tradeskill as Tradeskill];
        const nextMessage = messages.shift();

        if(!nextMessage) {
          return;
        }

        if(nextMessage === 'EMPTY') {
          this.tradeskillEmits.next({ tradeskill, message: '' });
          return;
        }

        this.tradeskillEmits.next({ tradeskill, message: nextMessage });

        if(messages.length === 0) {
          messages.push('EMPTY');
        }
      });
    });
  }

  private notificationPosition() {
    return this.store.selectSnapshot(state => state.options?.[GameOption.NotificationCorner]) ?? 'left-top';
  }

  private showNotifications() {
    return this.store.selectSnapshot(state => state.options?.[GameOption.ShowNotifications]) ?? true;
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

    if(!this.showNotifications()) {
      return;
    }

    Notify.info(message, {
      ...this.notiflixDefaults()
    });
  }

  public error(message: string) {
    this.logMessage(message);

    if(!this.showNotifications()) {
      return;
    }

    Notify.failure(message, {
      ...this.notiflixDefaults()
    });
  }

  public warn(message: string) {
    this.logMessage(message);

    if(!this.showNotifications()) {
      return;
    }

    Notify.warning(message, {
      ...this.notiflixDefaults()
    });
  }

  public success(message: string) {
    this.logMessage(message);

    if(!this.showNotifications()) {
      return;
    }

    Notify.success(message, {
      ...this.notiflixDefaults()
    });
  }

  public tradeskill(tradeskill: Tradeskill, message: string) {
    this.logMessage(message);

    if(!this.showNotifications()) {
      return;
    }

    this.nextTradeskillMessages[tradeskill].push(message);
  }

  public achievement(message: string) {
    this.logMessage(message);

    if(!this.showNotifications()) {
      return;
    }

    Notify.success(message, {
      ...this.notiflixDefaults(),
      className: 'notiflix-notify-achievement'
    });
  }

  public async confirm(header: string, message: string, buttons: any[] = []) {
    const alert = await this.alertCtrl.create({
      cssClass: 'yesno',
      header,
      message,
      buttons
    });

    await alert.present();
  }
}
