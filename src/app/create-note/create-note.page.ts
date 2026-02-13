import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trash, addCircleOutline } from 'ionicons/icons';
import { NoteService } from '../services/note-service';
import { Note } from '../models/Note';

import { Router } from '@angular/router';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.page.html',
  styleUrls: ['./create-note.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CreateNotePage {
   note: Note = {
    noteId: 0,
    title: '',
    details: [],
    createdAt: new Date().toISOString(),
  };

  constructor(private noteService: NoteService, private router: Router) {
    addIcons({ trash, addCircleOutline });
  }

  async onSubmit() {
    console.log('📤 Sending note:', this.note);

    const guid = this.generateGUID();
    try {
      await this.noteService.createNote(this.note, 'angular', 'jlromero', guid);
      this.router.navigate(['/note-list']);
    } catch (error) {
       console.error('Error creating note:', error);
       alert('Error al crear la nota');
    }
  }

  addDetail() {
    this.note.details.push({ key: '', value: '', sensitive: false });
  }

  removeDetail(index: number) {
    this.note.details.splice(index, 1);
  }

  generateGUID() {
    return crypto.randomUUID();
  }
}
