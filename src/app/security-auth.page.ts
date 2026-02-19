import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonCard, 
  IonCardContent, 
  NavController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosed, eye, eyeOff } from 'ionicons/icons';
import { SecurityService } from './services/security.service';

@Component({
  selector: 'app-security-auth',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent
  ],
  template: `
    <ion-content class="ion-padding ion-text-center">
      <div class="auth-wrapper">
        <div class="lock-icon">
          <ion-icon name="lock-closed" color="primary"></ion-icon>
        </div>
        
        <h2>{{ isSetup ? 'Configura tu Seguridad' : 'Acceso Protegido' }}</h2>
        
        <p class="instruction-text">
          {{ isSetup 
            ? 'Antes de registrar tu primera nota, ingresa una contraseña maestra para proteger tus datos.' 
            : 'Ingresa tu contraseña maestra para desbloquear tus notas.' 
          }}
        </p>

        <ion-card mode="ios">
          <ion-card-content>
            <ion-item lines="none" class="input-item">
              <ion-label position="stacked">Contraseña Maestra</ion-label>
              <div class="password-input-container">
                <ion-input 
                  [type]="showPassword ? 'text' : 'password'" 
                  [(ngModel)]="password" 
                  placeholder="Ingresa tu clave"
                  (keyup.enter)="verificar()">
                </ion-input>
                <ion-button fill="clear" (click)="showPassword = !showPassword" class="toggle-btn">
                  <ion-icon slot="icon-only" [name]="showPassword ? 'eye-off' : 'eye'"></ion-icon>
                </ion-button>
              </div>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <p *ngIf="error" class="error-msg">{{ error }}</p>

        <ion-button expand="block" mode="ios" (click)="verificar()" class="ion-margin-top">
          {{ isSetup ? 'Guardar y Entrar' : 'Desbloquear Ahora' }}
        </ion-button>
      </div>
    </ion-content>

    <style>
      .auth-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 20px;
      }
      .lock-icon {
        font-size: 80px;
        margin-bottom: 20px;
        background: #f0f4ff;
        padding: 20px;
        border-radius: 50%;
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      h2 { font-weight: bold; color: #333; margin-top: 10px; }
      .instruction-text { color: #666; margin-bottom: 30px; line-height: 1.5; font-size: 1.1em; }
      .input-item { background: #f9f9f9; border-radius: 10px; --padding-start: 10px; }
      .error-msg { color: var(--ion-color-danger); margin-top: 15px; font-weight: 500; }
      ion-card { width: 100%; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 15px; }
      .password-input-container {
        display: flex;
        align-items: center;
        width: 100%;
      }
      .toggle-btn {
        --padding-start: 0;
        --padding-end: 0;
        margin-top: 15px;
      }
    </style>
  `
})
export default class SecurityAuthPage {
  password = '';
  error = '';
  isSetup = false;
  showPassword = false;

  private securityService = inject(SecurityService);
  private navCtrl = inject(NavController);

  constructor() {
    addIcons({ lockClosed, eye, eyeOff });
  }

  async ionViewWillEnter() {
    this.isSetup = !(await this.securityService.hasMasterKey());
  }

  async verificar() {
    if (this.password.length < 4) {
      this.error = 'La clave debe tener al menos 4 caracteres.';
      return;
    }

    if (this.isSetup) {
      this.securityService.setupMasterKey(this.password);
      this.navCtrl.back(); 
    } else {
      const valido = await this.securityService.validateMasterKey(this.password);
      if (valido) {
        this.navCtrl.back();
      } else {
        this.error = 'Contraseña incorrecta.';
        this.password = '';
      }
    }
  }
}
