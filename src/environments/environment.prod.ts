export const environment = {
  production: true,
  platform: 'web',
  firebase: {
    projectId: 'worldseller-game',
    appId: '1:81870725196:web:06643266ef102cab2854e9',
    storageBucket: 'worldseller-game.appspot.com',
    apiKey: 'AIzaSyDIzNcOeEU5KNFJkdNJaIkcp4mCpkP3nQg',
    authDomain: 'worldseller-game.firebaseapp.com',
    messagingSenderId: '81870725196',
  },
  gameanalytics: {
    game: '2bad240b0b240bf0ea27192f5dacf088',
    key: '3c30922a1a286ceada5994ee67bed73bb95d256f'
  },
  rollbar: {
    environment: 'production',
    apiKey: '4e3cb475d578456b8ef37803091dceee'
  },
  modio: {
    url: 'https://api.mod.io/v1',
    modsUrl: 'https://mod.io/g/world-seller',
    gameId: 4781,
    apiKey: '6b660beed0a5339dd9ce7d7a07e3d537'
  }
};
