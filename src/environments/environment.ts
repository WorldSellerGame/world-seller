// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  platform: 'web',
  gameanalytics: {
    game: '54e16e53be300ab8adb7a3a9fd032ac0',
    key: '87f86587d3f4c13572a434d641c4be98e1607937'
  },
  rollbar: {
    environment: 'local',
    apiKey: 'c34a4c9b582b4fe3bd6bfc48666687ed'
  },
  modio: {
    url: 'https://api.test.mod.io/v1',
    modsUrl: 'https://worldseller.test.mod.io/',
    gameId: 1018,
    apiKey: 'c534785e553448834f567e4d4229bdf5'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
