import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularFire2';
import firebase, { initializeApp } from 'firebase';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { EmailComposer } from '@ionic-native/email-composer';
export const Firebase_Config = {
  apiKey: "AIzaSyD8n8jzftJjze6VjfwUfWmTRfn4T943PVo",
  authDomain: "codificador-a02bf.firebaseapp.com",
  databaseURL: "https://codificador-a02bf.firebaseio.com",
  projectId: "codificador-a02bf",
  storageBucket: "codificador-a02bf.appspot.com",
  messagingSenderId: "662816514180"
}

firebase.initializeApp(Firebase_Config);
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: true,
      scrollAssist: false,
      autoFocusAssist: false
    }),
    AngularFireModule.initializeApp(Firebase_Config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    EmailComposer,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule { }
