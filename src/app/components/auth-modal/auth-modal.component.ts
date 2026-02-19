import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>{{ isSetup ? 'Configurar Seguridad' : 'Acceso Protegido' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding ion-text-center">
      <div class="auth-container">
        <ion-icon name="lock-closed-outline" color="primary" style="font-size: 64px;"></ion-icon>
        
        <h2>{{ isSetup ? 'Protege tus Notas' : '¡Hola de nuevo!' }}</h2>
        <p>
          {{ isSetup 
            ? 'Antes de registrar tu primera nota, ingresa una contraseña maestra para cifrar tus datos.' 
            : 'Por seguridad, ingresa tu contraseña maestra para continuar.' 
          }}
        </p>

        <ion-item lines="outline" class="ion-margin-top">
          <ion-label position="floating">Contraseña Maestra</ion-label>
          <ion-input 
            type="password" 
            [(ngModel)]="password" 
            placeholder="********"
            (keyup.enter)="confirmar()">
          </ion-input>
        </ion-item>

        <p *ngIf="errorMessage" color="danger" class="error-text">
          {{ errorMessage }}
        </p>

        <ion-button expand="block" class="ion-margin-top" (click)="confirmar()">
          {{ isSetup ? 'Guardar y Continuar' : 'Desbloquear' }}
        </ion-button>
      </div>
    </ion-content>

    <style>
      .auth-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        max-width: 400px;
        margin: 0 auto;
      }
      .error-text {
        color: var(--ion-color-danger);
        font-size: 0.9em;
        margin-top: 10px;
      }
      h2 { margin-top: 20px; font-weight: bold; }
      p { color: #666; }
    </style>
  `
})
export class AuthModalComponent implements OnInit {
  @Input() isSetup: boolean = false;
  
  password = '';
  errorMessage = '';
  
  private modalCtrl = inject(ModalController);
  private securityService = inject(SecurityService);

  ngOnInit() {}

  async confirmar() {
    if (!this.password || this.password.length < 4) {
      this.errorMessage = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }

    if (this.isSetup) {
      this.securityService.setupMasterKey(this.password);
      this.modalCtrl.dismiss(true);
    } else {
      const valid = await this.securityService.validateMasterKey(this.password);
      if (valid) {
        this.modalCtrl.dismiss(true);
      } else {
        this.errorMessage = 'Contraseña incorrecta. Intenta de nuevo.';
        this.password = '';
      }
    }
  }
}
