import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {IonicModule} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonicModule, RouterLink],
})
export class AppComponent {
  constructor() {}
}
