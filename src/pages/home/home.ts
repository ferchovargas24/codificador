import { Component } from '@angular/core';
import { NavController, AlertController, ActionSheetController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';
import { LoginPage } from '../login/login';
import { base64Encode, base64Decode } from '@firebase/util';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  formgroup: FormGroup;
  text: AbstractControl;
  mensajes: Array<any> = [];
  contraseñas: Array<any> = [];
  info;
  passMens;
  usuario;
  
  public refUsuarios: firebase.database.Reference = firebase.database().ref('/usuarios');

  constructor(public navCtrl: NavController, private navParams: NavParams,
    public fb: FormBuilder,
    private alerta: AlertController,
    private mensaje: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private email: EmailComposer,
    private gplus: GooglePlus
  ) {

    this.info = this.navParams.get('info');
    this.formgroup = fb.group({
      text: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9. ]+')])],
    });
    this.text = this.formgroup.controls['text'];
  }


  cifrando(txt, password) {

    var mensajeCifrado = base64Encode(txt);

    this.refUsuarios.on('value', usuSnap => {
      usuSnap.forEach(usuarioSnap => {
        
        if (usuarioSnap.val().usuario == this.info.email) {
          this.usuario=usuarioSnap.key;
        }
        return false;
      });
    });

    const refMensajes: firebase.database.Reference = firebase.database().ref('/usuarios/'+ this.usuario+'/mensajesCodificados');
    refMensajes.push({ mensajeCifrado, password });
    let alert = this.alerta.create({
      title: 'Gracias por usar nuestro codificador',
      message: "Tu texto codificado es: " + mensajeCifrado + " \nPor favor, apuntalo",
      buttons: [
        {
          text: 'Mandar por email',
          handler: data => {
            this.email.open({
              app: 'gmail',
              body: "Mensaje codificado: " + mensajeCifrado + "\nContraseña: " + password

            });
          }
        }]

    })
    alert.present();
  }



  descifrando(txt: string, password) {


const refMensajes: firebase.database.Reference = firebase.database().ref('/usuarios/'+this.usuario+'/mensajesCodificados');
    refMensajes.on('value', mensajeSnap => {
      mensajeSnap.forEach(mensSnap => {
        
        if (mensSnap.val().mensajeCifrado == txt) {
          this.passMens = mensSnap.val().password;
        }
        return false;
      });
    });


   

    if (this.passMens == password) {

      var mensajeDescifrado = base64Decode(txt)

      let alert = this.alerta.create({
        title: 'Gracias por usar nuestro codificador',
        message: "El texto decodificado es: " + mensajeDescifrado + " Por favor, apuntalo",
        buttons: ['OK']

      })
      alert.present();

    } else {

      let alert = this.alerta.create({
        title: 'ERROR',
        message: "La contraseña es incorrecta",
        buttons: [
          {
            text: 'Cancelar',
          },
          {
            text: 'Volver a intentar',
            handler: data => {
              this.mostrarOpciones(txt)
            }
          }
        ]

      })
      alert.present();
    }


  }

  mostrarOpciones(txt: string) {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Que quieres hacer?',
      buttons: [
        {
          text: 'Cifrar',
          handler: () => {

            let prompt = this.alerta.create({
              title: 'Cifrando',
              message: "Ambos campos son requeridos",
              inputs: [
                {
                  name: 'contraseña',
                  placeholder: 'Contraseña',
                  type: 'password',

                }
              ],
              buttons: [
                {
                  text: 'Cancelar',
                },
                {
                  text: 'OK',
                  handler: data => {
                    this.cifrando(txt, data.contraseña);
                  }
                }
              ]
            });
            prompt.present();
          }
        }, {
          text: 'Descifrar',
          handler: () => {

            let prompt = this.alerta.create({
              title: 'Descifrando',
              message: "Introduce una contraseña",
              inputs: [
                {
                  name: 'contraseña',
                  placeholder: 'Contraseña',
                  type: 'password'

                }
              ],
              buttons: [
                {
                  text: 'Cancel',
                },
                {
                  text: 'OK',
                  handler: data => {
                    this.descifrando(txt, data.contraseña);
                  }
                }
              ]
            });
            prompt.present();
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  logout() {

    this.gplus.logout().then(() => {
      this.navCtrl.setRoot(LoginPage)
    })
  }

}
