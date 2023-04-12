import { Component, OnInit } from '@angular/core';
import { AuthErrorCodes } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { UpdateFirebaseUID } from '../../../stores/game/game.actions';
import { CloudSaveService } from '../../services/cloudsave.service';

@Component({
  selector: 'app-cloud-login',
  templateUrl: './cloud-login.component.html',
  styleUrls: ['./cloud-login.component.scss'],
})
export class CloudLoginComponent implements OnInit {

  public type: 'login' | 'register' = 'login';
  public email = '';
  public password = '';

  public error = '';

  public get canDoAnything() {
    return this.email && this.password;
  }

  constructor(
    private store: Store,
    public modal: ModalController,
    public cloudSaveService: CloudSaveService
  ) { }

  ngOnInit() {}

  changeType(type: 'login' | 'register') {
    this.email = '';
    this.password = '';
    this.error = '';
  }

  async signup() {
    this.error = '';

    try {
      const res = await this.cloudSaveService.register(this.email, this.password);
      this.store.dispatch(new UpdateFirebaseUID(res.user?.uid ?? ''));
      this.modal.dismiss();
    } catch(e) {
      const err = e as Error;
      this.determineError(err.message);
    }
  }

  async login() {
    this.error = '';

    try {
      const res = await this.cloudSaveService.login(this.email, this.password);
      this.store.dispatch(new UpdateFirebaseUID(res.user?.uid ?? ''));
      this.modal.dismiss();

      this.cloudSaveService.openManage();
    } catch(e) {
      const err = e as Error;
      this.determineError(err.message);
    }
  }

  private determineError(errorMessage: string) {
    let error = '';

    if(errorMessage.includes(AuthErrorCodes.EMAIL_EXISTS)) {
      error = 'That email is already in use.';
    }

    if(errorMessage.includes(AuthErrorCodes.INVALID_EMAIL)) {
      error = 'That email is not valid.';
    }

    if(errorMessage.includes(AuthErrorCodes.INVALID_PASSWORD)) {
      error = 'That password is not valid.';
    }

    if(errorMessage.includes(AuthErrorCodes.WEAK_PASSWORD)) {
      error = 'That password is too weak.';
    }

    if(errorMessage.includes(AuthErrorCodes.USER_DISABLED)) {
      error = 'That user has been disabled.';
    }

    if(errorMessage.includes(AuthErrorCodes.USER_CANCELLED)) {
      error = 'That user has been cancelled.';
    }

    if(errorMessage.includes(AuthErrorCodes.USER_DELETED)) {
      error = 'That user was not found.';
    }

    if(errorMessage.includes(AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER)) {
      error = 'Too many attempts. Try later.';
    }

    if(!error) {
      error = `An unknown error occurred. Send this to the developer: ${errorMessage}`;
    }

    this.error = error;
  }

}
