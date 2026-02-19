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
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline, eyeOutline, eyeOffOutline, add, downloadOutline } from 'ionicons/icons';
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
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
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

  constructor() {
    addIcons({ trashOutline, createOutline, eyeOutline, eyeOffOutline, add, downloadOutline });
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
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error al eliminar la nota');
    }
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

      // Generar el contenido del archivo (JSON formateado)
      const dataStr = JSON.stringify(this.notes, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `Respaldo_Notas_${new Date().toISOString().slice(0,10)}.json`;
      
      // Crear un elemento link temporal para disparar la descarga
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      console.log('✅ Notas descargadas con éxito');
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('Error al generar la descarga');
    }
  }
}
