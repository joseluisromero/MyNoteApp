import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSearchbar,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonPopover,
  IonList,
  Platform,
} from '@ionic/angular/standalone';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline, eyeOutline, eyeOffOutline, add, downloadOutline, ellipsisVertical } from 'ionicons/icons';
import { Note } from '../models/Note';
import { NoteService } from '../services/note-service';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.page.html',
  styleUrls: ['./note-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonSearchbar,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonPopover,
    IonList,
  ]
})
export class NoteListPage implements OnInit {
  
  xDevice = 'angular';
  xUser = 'jlromero';
  xGuid = '';
  
  notes: Note[] = [];
  searchTerm: string = '';
  openAccordions: string[] | string | undefined = undefined;
  
  // Posición del FAB
  fabPosition = { x: 0, y: 0 };
  private isDragging = false;

  noteService = inject(NoteService);
  authService = inject(AuthService);
  private platform = inject(Platform);

  constructor() {
    addIcons({ trashOutline, createOutline, eyeOutline, eyeOffOutline, add, downloadOutline, ellipsisVertical });
  }

  ngOnInit() {
    this.xGuid = this.generateGUID();
    // Posicionamos el botón más arriba por defecto
    this.fabPosition.y = 300;
    console.log('x-guid:', this.xGuid);
  }

  async ionViewWillEnter() {
    this.openAccordions = undefined; // Cierra todos los acordeones
    const isAuth = await this.authService.ensureAuthorized();
    if (isAuth) {
      this.loadNotes();
    }
  }

  async loadNotes() {
    try {
      this.notes = await this.noteService.getAllNotesWithHeaders(this.xDevice, this.xUser, this.xGuid);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  async deleteNote(noteId: number) {
    if (!confirm('¿Estás seguro de eliminar esta nota?')) return;
    
    try {
      await this.noteService.deleteNote(noteId, this.xDevice, this.xUser, this.xGuid);
      // Actualizar la lista localmente o recargar
      this.notes = this.notes.filter(n => n.noteId !== noteId);
      
      // Cerrar acordeones si es necesario (opcional)
      this.openAccordions = undefined;
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error al eliminar la nota');
    }
  }

  closePopover(popover: any) {
    popover.dismiss();
  }

  /** Filtra notas por título según el término de búsqueda */
  getFilteredNotes(): Note[] {
    if (!this.searchTerm.trim()) {
      return this.notes;
    }
    return this.notes.filter(note =>
      note.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /** Genera un GUID v4 en formato 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' */
  generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /** Inicia el arrastre */
  onDragStart(event: any) {
    this.isDragging = true;
  }

  /** Maneja el movimiento del dedo/mouse */
  onDragMove(event: any) {
    if (!this.isDragging) return;
    
    const touch = event.touches ? event.touches[0] : event;
    
    // Calculamos posición desde el borde inferior derecho
    const x = window.innerWidth - touch.clientX - 28; 
    const y = window.innerHeight - touch.clientY - 28;
    
    // Límites para que no se salga de la pantalla y no interfiera con gestos del sistema
    this.fabPosition.x = Math.max(10, Math.min(window.innerWidth - 60, x));
    this.fabPosition.y = Math.max(80, Math.min(window.innerHeight - 100, y));
  }

  /** Finaliza el arrastre */
  onDragEnd() {
    this.isDragging = false;
  }

  trackByNotes(index: number, note: Note): number {
    return note.noteId;
  }

async downloadNotes() {
  if (this.notes.length === 0) {
    alert('No hay notas para descargar.');
    return;
  }

  try {
    // Pedir autorización si hay notas sensibles
    const isAuth = await this.authService.ensureAuthorized();
    if (!isAuth) return;

    const dataStr = JSON.stringify(this.notes, null, 2);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const exportFileDefaultName = `Respaldo_Secure_Notes_${formattedDate}.json`;
    const exportDir = 'SecureNotesBackups';
    if (this.platform.is('hybrid')) {
      // Lógica para Android/iOS usando Capacitor Filesystem
      try {
        // Crear carpeta de exportacion dentro de Documents si no existe
        await Filesystem.mkdir({
          path: exportDir,
          directory: Directory.Documents,
          recursive: true
        });

        const result = await Filesystem.writeFile({
          path: `${exportDir}/${exportFileDefaultName}`,
          data: dataStr,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        });

        alert(`Archivo guardado exitosamente en Documentos/${exportDir}:\n${result.uri}`);
      } catch (e) {
        console.error('Error guardando archivo nativo:', e);
        alert('Error al guardar el archivo en el dispositivo.');
      }
    } else {
      // Lógica para Navegador Web
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      console.log('✅ Notas descargadas con éxito (Web)');
    }
  } catch (error) {
    console.error('Error al descargar:', error);
    alert('Error al generar la descarga');
  }
}
}