import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
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
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonItem,
  IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, listOutline, pencilOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonButton,
    IonItem,
    IonInput
  ]
})
export class HomePage {
  userName = 'Usuario';
  isEditingName = false;
  private storage = inject(Storage);
  private _storage: Storage | null = null;
  private alertCtrl = inject(AlertController);

  constructor() {
    addIcons({ addCircleOutline, listOutline, pencilOutline, checkmarkCircleOutline });
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    const savedName = await this._storage.get('userName');
    if (savedName) {
      this.userName = savedName;
    }
  }

  toggleEditName() {
    this.isEditingName = !this.isEditingName;
  }

  async saveName() {
    if (this.userName && this.userName.trim()) {
      await this._storage?.set('userName', this.userName.trim());
    }
    this.isEditingName = false;
  }
}
