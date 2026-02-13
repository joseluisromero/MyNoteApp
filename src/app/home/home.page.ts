import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from "@ionic/angular";
import { addIcons } from 'ionicons';
import { addCircleOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, FormsModule, RouterLink, IonicModule]
})
export class HomePage {
  userName = 'Jose Luis';

  constructor() {
    addIcons({ addCircleOutline, listOutline });
  }
}
