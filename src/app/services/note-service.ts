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
  buildRequiredHeaders(xDevice: string, xUser: string, xGuid: string, xDeviceIp: string = '127.0.0.1'): HttpHeaders {
    return new HttpHeaders()
      .set('x-device', xDevice)
      .set('x-user', xUser)
      .set('x-guid', xGuid)
      .set('x-device-ip', xDeviceIp);
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

  /** Obtiene una nota por su ID */
  getNoteById(noteId: number, xDevice: string, xUser: string, xGuid: string): Promise<Note> {
    const headers = this.buildRequiredHeaders(xDevice, xUser, xGuid);
    return firstValueFrom(
      this.httClient.get<Note>(`http://localhost:8080/api/notes/${noteId}`, { headers })
    );
  }

  createNote(data: Note,xDevice: string, xUser: string, xGuid: string): Promise<Note> {
    const headers = this.buildRequiredHeaders(xDevice, xUser, xGuid);

    return firstValueFrom(
      this.httClient.post<Note>('http://localhost:8080/api/notes', data, { headers })
    ).then(response => {
      console.log('✅ Nota creada exitosamente:', response);
      return response;
    }).catch(error => {
      console.error('❌ Error al crear la nota:', error);
      throw error;
    });
  }

  /** Actualiza una nota existente */
  updateNote(data: Note, xDevice: string, xUser: string, xGuid: string, xDeviceIp: string = '127.0.0.1'): Promise<Note> {
    const headers = this.buildRequiredHeaders(xDevice, xUser, xGuid, xDeviceIp);
    console.log(`📝 Actualizando nota ${data.noteId}...`);

    return firstValueFrom(
      this.httClient.put<Note>(`http://localhost:8080/api/notes/${data.noteId}`, data, { headers })
    ).then(response => {
      console.log('✅ Nota actualizada exitosamente:', response);
      return response;
    }).catch(error => {
      console.error('❌ Error al actualizar la nota:', error);
      throw error;
    });
  }

  /** Elimina una nota por su ID */
  deleteNote(noteId: number, xDevice: string, xUser: string, xGuid: string): Promise<void> {
    const headers = this.buildRequiredHeaders(xDevice, xUser, xGuid);
    console.log(`🗑️ Eliminando nota ${noteId}...`);
    
    return firstValueFrom(
      this.httClient.delete<void>(`http://localhost:8080/api/notes/${noteId}`, { headers })
    ).then(() => {
      console.log(`✅ Nota ${noteId} eliminada exitosamente.`);
    }).catch(error => {
      console.error(`❌ Error al eliminar la nota ${noteId}:`, error);
      throw error;
    });
  }
}
