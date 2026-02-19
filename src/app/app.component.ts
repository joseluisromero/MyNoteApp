import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonApp,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonMenuToggle,
  IonRouterOutlet,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { homeOutline, listOutline, addCircleOutline, cloudUploadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    RouterLink,
    IonApp,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonMenuToggle,
    IonRouterOutlet,
    IonIcon,
    IonLabel,
    CommonModule
  ],
})
export class AppComponent implements OnInit {
  constructor() {
    addIcons({ homeOutline, listOutline, addCircleOutline, cloudUploadOutline });
  }

  ngOnInit() {
    console.log('🚀 App iniciada.');
  }
}
