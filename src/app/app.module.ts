import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import * as Stores from '../stores';
import * as Migrations from '../stores/migrations';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { isInElectron } from './helpers/electron';
import { AchievementsService } from './services/achievements.service';
import { AnalyticsService } from './services/analytics.service';
import { CloudSaveService } from './services/cloudsave.service';
import { ContentService } from './services/content.service';
import { DebugService } from './services/debug.service';
import { MetaService } from './services/meta.service';
import { ModsService } from './services/mods.service';
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
    NgxWebstorageModule.forRoot(),
    AppRoutingModule,
    NgxTippyModule,
    SharedModule,
    AngularSvgIconModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode() && !isInElectron(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgxsModule.forRoot(allStores, {
      developmentMode: !isDevMode()
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: !isDevMode(),
      filter: action => !action.constructor.name.includes('Timer')
    }),
    NgxsStoragePluginModule.forRoot({
      key: allStores,
      migrations: Object.values(Migrations).flat(),
      storage: StorageOption.LocalStorage
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],

  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [
        CloudSaveService,
        MetaService,
        AnalyticsService,
        RollbarService,
        ContentService,
        AchievementsService,
        DebugService,
        ModsService
      ],
      useFactory: (
        cloudSaveService: CloudSaveService,
        metaService: MetaService,
        analyticsService: AnalyticsService,
        rollbarService: RollbarService,
        contentService: ContentService,
        achievementsService: AchievementsService,
        debugService: DebugService,
        modsService: ModsService
      ) => async () => {
        await cloudSaveService.init();
        await metaService.init();
        analyticsService.init();
        rollbarService.init();
        contentService.init();
        achievementsService.init();
        debugService.init();
        await modsService.init();
      }
    },
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
