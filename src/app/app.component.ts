import { Component } from '@angular/core';
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
    IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
