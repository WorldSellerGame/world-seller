/* eslint-disable @typescript-eslint/naming-convention */

import * as Rollbar from 'rollbar';

import {
  ErrorHandler,
  Injectable
} from '@angular/core';

import { Store } from '@ngxs/store';
import { environment } from '../../environments/environment';
import { MetaService } from './meta.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class RollbarService {

  private rollbar!: Rollbar;

  public get rollbarInstance() {
    return this.rollbar;
  }

  constructor(
    private metaService: MetaService
  ) {}

  init() {
    const rollbarConfig = {
      accessToken: environment.rollbar.apiKey,
      captureUncaught: true,
      captureUnhandledRejections: true,
      hostBlockList: ['netlify.app'],
      hostSafelist: ['worldsellergame.com'],
      payload: {
        environment: environment.rollbar.environment,
        code_version: this.metaService.version
      }
    };

    this.rollbar = new Rollbar(rollbarConfig);
  }
}

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {

  constructor(
    private store: Store,
    private notify: NotifyService,
    private rollbar: RollbarService
  ) {
    window.onerror = (err) => this.handleError(err);
  }

  private isValidError(err: any): boolean {
    if(err.message.includes('Firebase') && err.message.includes('auth/')) {
      return false;
    }

    return true;
  }

  handleError(err: any): void {
    console.error(err);

    if(!this.isValidError(err)) {
      return;
    }

    const savefile = this.store.snapshot();
    delete savefile.mods;

    // check if the user will let errors be sent
    if(savefile.options.telemetryErrors) {
      const extraOptions: any = {};

      // double check if the user will let their savefile be sent
      if(savefile.options.telemetrySavefiles) {
        extraOptions.gameState = JSON.stringify(savefile);
      }

      // send the error, and possibly the savefile
      this.rollbar.rollbarInstance?.error(err.originalError || err, extraOptions);
    }

    // if we have debug mode enabled, tell the player an error happened
    if(savefile.options.debugMode) {
      this.notify.error(err.message);
    }
  }
}
