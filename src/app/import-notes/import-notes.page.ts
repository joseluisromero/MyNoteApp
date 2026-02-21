import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline, documentAttachOutline, syncOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { NoteService } from '../services/note-service';
import { SecurityService } from '../services/security.service';
import { Note, mapJsonToNote } from '../models/Note';

@Component({
  selector: 'app-import-notes',
  templateUrl: './import-notes.page.html',
  styleUrls: ['./import-notes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonCheckbox,
  ],
})
export class ImportNotesPage {
  xDevice = 'angular';
  xUser = 'jlromero';
  xGuid = this.generateGUID();

  fileName = '';
  parsedNotes: Note[] = [];
  isParsing = false;
  isSyncing = false;
  wantsImport = false;
  canImport = false;
  showDetectedTitles = false;
  showSkippedNotes = false;
  skippedNotes: { title: string; reason: string }[] = [];
  status: 'idle' | 'success' | 'error' = 'idle';
  statusMessage = '';

  private noteService = inject(NoteService);
  private authService = inject(AuthService);
  private securityService = inject(SecurityService);

  constructor() {
    addIcons({
      cloudDownloadOutline,
      documentAttachOutline,
      syncOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
    });
  }

  ionViewWillEnter(): void {
    // Si el usuario ya marco importar, al volver desde security-auth habilitamos sin refrescar manualmente.
    this.canImport = this.wantsImport && this.securityService.isKeySet();
    if (this.canImport && this.status === 'error') {
      this.resetStatus();
    }
  }

  async onImportIntentChange(event: any): Promise<void> {
    const checked = !!event?.detail?.checked;
    this.resetStatus();
    this.wantsImport = checked;

    if (!checked) {
      this.canImport = false;
      this.fileName = '';
      this.parsedNotes = [];
      this.showDetectedTitles = false;
      this.showSkippedNotes = false;
      this.skippedNotes = [];
      return;
    }

    const authorized = await this.authService.ensureAuthorized();
    this.canImport = authorized;

    if (!authorized) {
      this.status = 'error';
      this.statusMessage = 'Debes validar tu clave maestra para importar notas.';
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    if (!this.canImport) {
      this.status = 'error';
      this.statusMessage = 'Primero marca que deseas importar y valida tu clave maestra.';
      return;
    }

    const authorized = await this.authService.ensureAuthorized();
    if (!authorized) {
      this.canImport = false;
      this.wantsImport = false;
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.resetStatus();

    if (!file) {
      this.fileName = '';
      this.parsedNotes = [];
      return;
    }

    if (!file.name.toLowerCase().endsWith('.json')) {
      this.status = 'error';
      this.statusMessage = 'Selecciona un archivo con extension .json';
      this.fileName = file.name;
      this.parsedNotes = [];
      return;
    }

    this.fileName = file.name;
    this.isParsing = true;
    this.showSkippedNotes = false;
    this.skippedNotes = [];

    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      const sourceArray = Array.isArray(raw) ? raw : [raw];
      const mappedNotes = sourceArray.map((item) => mapJsonToNote(item));

      const validNotes = mappedNotes.filter(
        (note) => note.title.trim().length > 0 && Array.isArray(note.details)
      );

      this.parsedNotes = validNotes;
      this.showDetectedTitles = false;

      if (this.parsedNotes.length === 0) {
        this.status = 'error';
        this.statusMessage = 'El JSON no contiene notas validas para importar.';
      }
    } catch (error) {
      console.error('Error leyendo JSON:', error);
      this.status = 'error';
      this.statusMessage = 'No se pudo leer el archivo JSON.';
      this.parsedNotes = [];
      this.showDetectedTitles = false;
    } finally {
      this.isParsing = false;
    }
  }

  async syncImportedNotes(): Promise<void> {
    if (this.parsedNotes.length === 0 || this.isSyncing) return;

    this.isSyncing = true;
    this.resetStatus();
    this.showSkippedNotes = false;
    this.skippedNotes = [];

    try {
      const authorized = await this.authService.ensureAuthorized();
      if (!authorized) {
        this.isSyncing = false;
        return;
      }

      const currentNotes = await this.noteService.getAllNotesWithHeaders(this.xDevice, this.xUser, this.xGuid);
      const existingTitles = new Set(
        currentNotes.map((note) => note.title.trim().toLowerCase()).filter((title) => title.length > 0)
      );
      let imported = 0;

      for (const rawNote of this.parsedNotes) {
        const normalizedTitle = rawNote.title.trim().toLowerCase();

        if (!rawNote.noteId) {
          this.skippedNotes.push({
            title: rawNote.title || '(sin titulo)',
            reason: 'No tiene noteId en el JSON',
          });
          continue;
        }

        if (existingTitles.has(normalizedTitle)) {
          this.skippedNotes.push({
            title: rawNote.title || '(sin titulo)',
            reason: 'Ya existe una nota con el mismo titulo',
          });
          continue;
        }

        const noteToSave: Note = {
          ...rawNote,
          noteId: rawNote.noteId,
          createdAt: rawNote.createdAt || new Date().toISOString(),
          details: Array.isArray(rawNote.details) ? rawNote.details : [],
        };

        await this.noteService.createNote(noteToSave, this.xDevice, this.xUser, this.xGuid);
        existingTitles.add(normalizedTitle);
        imported++;
      }

      this.status = 'success';
      this.statusMessage = `Importacion completada. Se guardaron ${imported} notas y se omitieron ${this.skippedNotes.length}.`;
      this.showSkippedNotes = this.skippedNotes.length > 0;
    } catch (error) {
      console.error('Error sincronizando notas importadas:', error);
      this.status = 'error';
      this.statusMessage = 'Ocurrio un error al sincronizar las notas.';
    } finally {
      this.isSyncing = false;
    }
  }

  private resetStatus(): void {
    this.status = 'idle';
    this.statusMessage = '';
  }

  private generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
