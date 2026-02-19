import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
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
      :host {
        --bg-color: #ffffff;
        --input-bg: #f5f7ff;
        --text-color: #333;
        --secondary-text: #666;
      }

      @media (prefers-color-scheme: dark) {
        :host {
          --bg-color: #121212;
          --input-bg: #1e1e1e;
          --text-color: #ffffff;
          --secondary-text: #a0a0a0;
        }
      }

      ion-content {
        --background: var(--bg-color);
      }

      .auth-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 24px;
        background: var(--bg-color);
      }

      .lock-icon {
        font-size: 72px;
        margin-bottom: 24px;
        background: rgba(var(--ion-color-primary-rgb), 0.1);
        color: var(--ion-color-primary);
        padding: 24px;
        border-radius: 50%;
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px rgba(var(--ion-color-primary-rgb), 0.15);
      }

      h2 { 
        font-weight: 800; 
        color: var(--text-color); 
        margin: 0 0 12px 0;
        font-size: 24px;
      }

      .instruction-text { 
        color: var(--secondary-text); 
        margin-bottom: 32px; 
        line-height: 1.6; 
        font-size: 16px;
        max-width: 280px;
      }

      ion-card { 
        width: 100%; 
        margin: 0;
        background: var(--input-bg);
        box-shadow: 0 12px 30px rgba(0,0,0,0.1); 
        border-radius: 20px;
        border: 1px solid rgba(var(--ion-color-primary-rgb), 0.1);
      }

      .input-item { 
        --background: transparent;
        --padding-start: 16px;
        margin: 8px 0;
      }

      ion-label {
        font-weight: 700 !important;
        color: var(--ion-color-primary) !important;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        font-size: 12px !important;
        margin-bottom: 12px !important;
      }

      .password-input-container {
        display: flex;
        align-items: center;
        width: 100%;
        background: rgba(var(--ion-color-step-200-rgb), 0.2);
        border-radius: 12px;
        padding-right: 8px;
        border: 2px solid transparent;
        transition: all 0.3s ease;
      }

      .password-input-container:focus-within {
        border-color: var(--ion-color-primary);
        background: rgba(var(--ion-color-step-200-rgb), 0.1);
      }

      ion-input {
        --padding-start: 12px;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-color);
      }

      .toggle-btn {
        --color: var(--secondary-text);
        margin: 0;
        height: 44px;
      }

      .error-msg { 
        color: var(--ion-color-danger); 
        margin-top: 20px; 
        font-weight: 600;
        font-size: 14px;
      }

      ion-button[expand="block"] {
        margin-top: 32px;
        --border-radius: 16px;
        --box-shadow: 0 8px 20px rgba(var(--ion-color-primary-rgb), 0.3);
        height: 56px;
        font-weight: 700;
        font-size: 16px;
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
