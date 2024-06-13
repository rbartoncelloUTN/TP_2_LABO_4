import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'tp-sala-juegos-a2ac6',
          appId: '1:472694916683:web:c43d2e2c5bd8409022efce',
          storageBucket: 'tp-sala-juegos-a2ac6.appspot.com',
          apiKey: 'AIzaSyAZlkCG0l0rVUgIo9txoLaIVJ_KY9jeNSU',
          authDomain: 'tp-sala-juegos-a2ac6.firebaseapp.com',
          messagingSenderId: '472694916683',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
