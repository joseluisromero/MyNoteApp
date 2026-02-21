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
  IonFooter,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { homeOutline, listOutline, addCircleOutline, cloudUploadOutline, cloudDownloadOutline, codeSlashOutline, mailOutline, logoGithub, logoLinkedin, logoWhatsapp } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
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
    IonFooter,
    CommonModule
  ],
})
export class AppComponent implements OnInit {

  constructor() {
    addIcons({ homeOutline, listOutline, addCircleOutline, cloudUploadOutline, cloudDownloadOutline, codeSlashOutline, mailOutline, logoGithub, logoLinkedin, logoWhatsapp });
  }

  ngOnInit() {
    console.log('🚀 App iniciada.');
  }
}
