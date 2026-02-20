import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonMenuButton, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFooter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, mailOutline, checkmarkCircleOutline, alertCircleOutline, constructOutline } from 'ionicons/icons';
import { NoteService } from '../services/note-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cloud-sync',
  templateUrl: './cloud-sync.page.html',
  styleUrls: ['./cloud-sync.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonMenuButton, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonFooter,
  ]
})
export class CloudSyncPage {
  email: string = '';
  isSyncing: boolean = false;
  syncStatus: 'idle' | 'success' | 'error' = 'idle';
  statusMessage: string = '';

  private noteService = inject(NoteService);
  private authService = inject(AuthService);

  constructor() {
    addIcons({ cloudUploadOutline, mailOutline, checkmarkCircleOutline, alertCircleOutline, constructOutline });
  }

  async onSync() {
    if (!this.email || !this.validateEmail(this.email)) {
      this.syncStatus = 'error';
      this.statusMessage = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    this.isSyncing = true;
    this.syncStatus = 'idle';

    try {
      // Primero aseguramos autorización por si hay notas sensibles
      const authorized = await this.authService.ensureAuthorized();
      if (!authorized) {
        this.isSyncing = false;
        return;
      }

      // Obtenemos todas las notas (de local o remoto según configuración)
      // Usamos valores temporales para las cabeceras ya que NoteService las requiere si no es local
      const notes = await this.noteService.getAllNotesWithHeaders('angular', 'jlromero', 'sync-guid');
      
      if (notes.length === 0) {
        this.syncStatus = 'error';
        this.statusMessage = 'No hay notas para sincronizar.';
        this.isSyncing = false;
        return;
      }

      console.log(`☁️ Sincronizando ${notes.length} notas al correo: ${this.email}`);
      
      // 1. Armar la información para el correo (Resumen de texto)
      let emailBody = 'RESPALDO DE MIS NOTAS\n\n';
      notes.forEach((note, index) => {
        emailBody += `------------------------------\n`;
        emailBody += `NOTA #${index + 1}: ${note.title}\n`;
        emailBody += `Fecha: ${new Date(note.createdAt).toLocaleString()}\n`;
        emailBody += `Detalles:\n`;
        note.details.forEach(detail => {
          emailBody += ` - ${detail.key}: ${detail.value} ${detail.sensitive ? '[SENSIBLE]' : ''}\n`;
        });
        emailBody += `\n`;
      });

      // 2. Intentar enviar vía Cliente de Correo del Dispositivo (mailto)
      const subject = encodeURIComponent('Respaldo de Secure Notes');
      const body = encodeURIComponent(emailBody);
      const mailtoUrl = `mailto:${this.email}?subject=${subject}&body=${body}`;
      
      // Abrimos el cliente de correo
      window.location.href = mailtoUrl;

      // 3. Dejar preparada la llamada real al servidor para el futuro
      try {
        await this.noteService.syncNotesToEmail(this.email, notes, 'angular', 'jlromero', 'sync-guid');
      } catch (apiError) {
        console.warn('Servidor no disponible para envío directo, se usó cliente local.', apiError);
      }

      this.syncStatus = 'success';
      this.statusMessage = `¡Éxito! Se han enviado ${notes.length} notas a ${this.email}.`;
    } catch (error) {
      console.error('Error en sincronización:', error);
      this.syncStatus = 'error';
      this.statusMessage = 'Ocurrió un error al intentar sincronizar las notas.';
    } finally {
      this.isSyncing = false;
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }
}
