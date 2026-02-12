import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Note } from '../models/Note';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
    httClient= inject(HttpClient);


  /** Construye las cabeceras requeridas por el servicio */
  buildRequiredHeaders(xDevice: string, xUser: string, xGuid: string): HttpHeaders {
    return new HttpHeaders()
      .set('x-device', xDevice)
      .set('x-user', xUser)
      .set('x-guid', xGuid);
  }

  /** Obtiene todas las notas enviando las cabeceras requeridas */
  getAllNotesWithHeaders(xDevice: string, xUser: string, xGuid: string): Promise<Note[]> {
    const headers = this.buildRequiredHeaders(xDevice, xUser, xGuid);
    
    // Log para verificar que las cabeceras se están construyendo correctamente
    console.log('📤 Enviando petición GET a /api/notes con cabeceras:');
    headers.keys().forEach(key => {
      console.log(`  ${key}: ${headers.get(key)}`);
    });

    // Call backend directly and observe full response to inspect response headers.
    return firstValueFrom(
      this.httClient.get<Note[]>('http://localhost:8080/api/notes', { headers, observe: 'response' as const })
    ).then(response => {
      console.log('✅ Respuesta exitosa, status:', response.status);
      console.log('📥 Response headers:', response.headers.keys());
      response.headers.keys().forEach(key => console.log(`  ${key}: ${response.headers.get(key)}`));
      return response.body || [];
    }).catch(error => {
      console.error('❌ Error en la petición:', error);
      throw error;
    });
  }

  createNote(data: Note,xDevice: string, xUser: string, xGuid: string) {;
    const headers = this.buildRequiredHeaders(xDevice, xUser, xGuid);

     this.httClient.post<Note>('http://localhost:8080/api/notes', data, { headers }).pipe().subscribe({
      next: (response) => {
        console.log('✅ Nota creada exitosamente:', response);
      },
      error: (error) => {
        console.error('❌ Error al crear la nota:', error);
      }
    });
  }
}
