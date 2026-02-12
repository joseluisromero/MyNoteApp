import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { Note } from '../models/Note';
import { NoteService } from '../services/note-service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.page.html',
  styleUrls: ['./note-list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,  IonicModule]
})
export class NoteListPage implements OnInit {
  
    notes: Note[] = [];
        searchTerm: string = '';

    noteService = inject(NoteService);


  async  ngOnInit() {
    const guid = this.generateGUID();
    console.log('x-guid:', guid);

    const response = await this.noteService.getAllNotesWithHeaders('angular', 'jlromero', guid);

    this.notes = response;
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
