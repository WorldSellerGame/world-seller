import { Injectable } from '@angular/core';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  public notify(message: string) {
    Notify.info(message, {
      useIcon: false,
      clickToClose: true,
      fontSize: '15px',
      timeout: 5000
    });
  }

  public error(message: string) {
    Notify.failure(message, {
      useIcon: false,
      clickToClose: true,
      fontSize: '15px',
      timeout: 5000
    });
  }

  public warn(message: string) {
    Notify.warning(message, {
      useIcon: false,
      clickToClose: true,
      fontSize: '15px',
      timeout: 5000
    });
  }

  public success(message: string) {
    Notify.success(message, {
      useIcon: false,
      clickToClose: true,
      fontSize: '15px',
      timeout: 5000
    });
  }
}
