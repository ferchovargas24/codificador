import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Spinner, AlertController } from 'ionic-angular';
import { AbstractControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HomePage } from '../home/home';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularFire2';
import firebase from 'firebase'
import { EmailComposer } from '@ionic-native/email-composer';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  formgroup: FormGroup;
  i: number;
  user: AbstractControl;
  pass: AbstractControl;
  isRegistered: boolean;

  constructor(public navCtrl: NavController, public fb: FormBuilder, private mensaje: ToastController,
    public googleplus: GooglePlus,
    private loadingCtrl: LoadingController,
    private email: EmailComposer,
    private alertCtrl: AlertController) {

    this.formgroup = fb.group({
      user: ['', Validators.required],
      pass: ['', Validators.required]
    });

    this.user = this.formgroup.controls['usuario'];
    this.pass = this.formgroup.controls['pass'];

  }


  async login() {

    let loading = this.loadingCtrl.create({
      content: 'Iniciando',
      spinner: 'dots'
    });

    await loading.present();
    this.googleplus.login({
      'webClientId': '662816514180-0g85a3ndvvuri8s83dvo1jt5dtuff1ff.apps.googleusercontent.com',
      'offline': true
    }).then(res => {
   
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then(succ => {

          this.navCtrl.setRoot(HomePage, { info: res })

          this.mensaje.create({
            message: "Bienvenido " + res.displayName,
            duration: 3000,
            position: 'top'
          }).present();
          loading.dismiss();


        }).catch(ns => {
          this.mensaje.create({
            message: "Hubo un error",
            duration: 3000
          })
        })
    })

  }

  info() {
    let alert = this.alertCtrl.create({
      title: 'Equipo',
      subTitle: 'Rocha Vargas José Fernando (Programador) ' + '\n Pichardo Aguilar Jorge (Investigador)',
      buttons: ['OK']
    });
    alert.present();
  }
}
