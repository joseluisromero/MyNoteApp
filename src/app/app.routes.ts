import { Routes } from '@angular/router';

export const routes: Routes = [
  //para que se  carge  la  pagina principal  al iniciar la app  y no se quede en blanco
{
  path: '', loadComponent: () => import('./main/main.page').then(m => m.MainPage)
},
{
  path:  'note-list', loadComponent: () => import('./note-list/note-list.page').then(m => m.NoteListPage)
},
  {
    path: 'create-note',
    loadComponent: () => import('./create-note/create-note.page').then( m => m.CreateNotePage)
  }

];
