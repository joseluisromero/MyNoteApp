import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormsModule } from '@angular/forms';
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
  IonCardSubtitle,
  IonCardContent,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, addCircleOutline } from 'ionicons/icons';
import { NoteService } from '../services/note-service';
import { AuthService } from '../services/auth.service';
import { Note } from '../models/Note';

import { Router } from '@angular/router';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.page.html',
  styleUrls: ['./create-note.page.scss'],
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
    IonCardSubtitle,
    IonCardContent,
    IonCheckbox,
  ]
})
export class CreateNotePage implements OnInit {
  private authService = inject(AuthService);
   note: Note = {
    noteId: 0,
    title: '',
    details: [],
    createdAt: new Date().toISOString(),
  };

  constructor(private noteService: NoteService, private router: Router) {
    addIcons({ trash, addCircleOutline });
  }

  async ngOnInit() {
  }

  async ionViewWillEnter() {
    this.resetNote();
    await this.authService.ensureAuthorized();
  }

  resetNote() {
    this.note = {
      noteId: 0,
      title: '',
      details: [],
      createdAt: new Date().toISOString(),
    };
  }

  async onSubmit() {
    console.log('📤 Enviando nota:', this.note);

    // Aseguramos que la clave maestra esté configurada/validada antes de guardar
    const isAuth = await this.authService.ensureAuthorized();
    if (!isAuth) {
      console.warn('⚠️ Guardado cancelado: Usuario no autorizado.');
      return;
    }

    const guid = this.generateGUID();
    try {
      await this.noteService.createNote(this.note, 'angular', 'jlromero', guid);
      this.router.navigate(['/note-list']);
    } catch (error) {
       console.error('Error creating note:', error);
       alert('Error al crear la nota: ' + error);
    }
  }

  addDetail() {
    this.note.details.push({ key: '', value: '', sensitive: false });
  }

  removeDetail(index: number) {
    this.note.details.splice(index, 1);
  }

  generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
