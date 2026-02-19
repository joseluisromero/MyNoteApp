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
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log('🚀 App iniciada.');
  }
}
