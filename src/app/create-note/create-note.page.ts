import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { NoteService } from '../services/note-service';
import { Note } from '../models/Note';

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

  constructor(private noteService: NoteService) {}

  onSubmit() {
    console.log('📤 Sending note:', this.note);

    const guid = this.generateGUID();
    this.noteService.createNote(this.note, 'angular', 'jlromero', guid);
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
