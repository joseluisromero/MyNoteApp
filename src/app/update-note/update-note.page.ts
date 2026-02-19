import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
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
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../services/note-service';
import { Note } from '../models/Note';
import { addIcons } from 'ionicons';
import { trash, addCircleOutline, save } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.page.html',
  styleUrls: ['./update-note.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
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
export class UpdateNotePage implements OnInit {
  note: Note = {
    noteId: 0,
    title: '',
    details: [],
    createdAt: new Date().toISOString(),
  };

  xDevice = 'angular';
  xUser = 'jlromero';
  xGuid = '';
  xDeviceIp = '127.0.0.1';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private noteService = inject(NoteService);
  private authService = inject(AuthService);

  constructor() {
    addIcons({ trash, addCircleOutline, save });
  }

  ngOnInit() {
    this.xGuid = this.generateGUID(); 
  }

  async ionViewWillEnter() {
    const isAuth = await this.authService.ensureAuthorized();
    if (!isAuth) return;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const noteId = +idParam;
      await this.loadNote(noteId);
    }
  }

  async loadNote(noteId: number) {
    try {
      // Usamos los mismos valores 'mock' que en la lista por ahora
      this.note = await this.noteService.getNoteById(noteId, this.xDevice, this.xUser, this.xGuid);
    } catch (error) {
      console.error('Error loading note to edit:', error);
      alert('Error al cargar la nota');
    }
  }

  async onUpdate() {
    console.log('📤 Updating note:', this.note);
    try {
      await this.noteService.updateNote(this.note, this.xDevice, this.xUser, this.xGuid, this.xDeviceIp);
      this.router.navigate(['/note-list']);
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Error al actualizar la nota');
    }
  }

  addDetail() {
    this.note.details.push({ key: '', value: '', sensitive: false });
  }

  removeDetail(index: number) {
    this.note.details.splice(index, 1);
  }

  generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
