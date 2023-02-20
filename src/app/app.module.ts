import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import * as Stores from '../stores';
import * as Migrations from '../stores/migrations';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnalyticsService } from './services/analytics.service';
import { MetaService } from './services/meta.service';
import { RollbarErrorHandler, RollbarService } from './services/rollbar.service';
import { SharedModule } from './shared.module';

// migrations must check each key they set and migrate to make sure they don't accidentally migrate twice
// the version of the state will always be set to 0 when a user opens the application for the first time
// thus, all migrations will be run on the second load

const allStores = Object.keys(Stores).filter(x => x.includes('State')).map(x => (Stores as Record<string, any>)[x]);

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgxTippyModule,
    SharedModule,
    AngularSvgIconModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgxsModule.forRoot(allStores, {
      developmentMode: !isDevMode()
    }),
    NgxsLoggerPluginModule.forRoot({
      filter: action => !action.constructor.name.includes('Timer')
    }),
    NgxsStoragePluginModule.forRoot({
      key: allStores,
      migrations: Object.values(Migrations).flat(),
      storage: StorageOption.LocalStorage
    }),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],

  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [MetaService, AnalyticsService, RollbarService],
      useFactory: (metaService: MetaService, analyticsService: AnalyticsService, rollbarService: RollbarService) => async () => {
        await metaService.init();
        analyticsService.init();
        rollbarService.init();
      }
    },
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
