import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline, eyeOutline, eyeOffOutline, add } from 'ionicons/icons';
import { Note } from '../models/Note';
import { NoteService } from '../services/note-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.page.html',
  styleUrls: ['./note-list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,  IonicModule, RouterLink]
})
export class NoteListPage implements OnInit {
  
  xDevice = 'angular';
  xUser = 'jlromero';
  xGuid = '';
  
  notes: Note[] = [];
  searchTerm: string = '';

  noteService = inject(NoteService);

  constructor() {
    addIcons({ trashOutline, createOutline, eyeOutline, eyeOffOutline, add });
  }

  ngOnInit() {
    this.xGuid = this.generateGUID();
    console.log('x-guid:', this.xGuid);
  }

  ionViewWillEnter() {
    this.loadNotes();
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

}
