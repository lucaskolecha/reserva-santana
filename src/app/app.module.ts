import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* Imports */
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NotifierModule } from 'angular-notifier';

/* Modulos */
import { LoginModule } from './login/login.module';
import { BaseModule } from './base/base.module';
import { RouterModule } from '@angular/router';

/* Componentes */
import { AppComponent } from './app.component';
import { BaseComponent } from './base/base.component';
import { HomeComponent } from './home/home.component';

import { HttpClientModule } from '@angular/common/http';
import '@uicapivara/cp-image-crop/index.js';

let config = {
  apiKey: "AIzaSyDpApjwuc0xauomIxlTDaoxGnqYGEjwVpE",
  authDomain: "reservasantana-bf475.firebaseapp.com",
  databaseURL: "https://reservasantana-bf475.firebaseio.com",
  projectId: "reservasantana-bf475",
  storageBucket: "reservasantana-bf475.appspot.com",
  messagingSenderId: "88684718732"
};

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BaseModule,
    LoginModule,
    HttpClientModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'top',
          distance: 24,
          gap: 10
        }
      }
    }),
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      }
    ], {
        useHash: true
      })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ] 
})
export class AppModule { }
