import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Note } from '../models/Note';
import { firstValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private httClient = inject(HttpClient);
  private storage = inject(Storage);
  private securityService = inject(SecurityService);
  private _storage: Storage | null = null;

  /** Bandera para decidir dónde guardar las notas */
  public useLocalStorage: boolean = true;

  API_URL_BASE = 'http://192.168.1.3:8080';

  constructor() {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /** Construye las cabeceras requeridas por el servicio */
  buildRequiredHeaders(xDevice: string, xUser: string, xGuid: string, xDeviceIp: string = '127.0.0.1'): HttpHeaders {
    return new HttpHeaders()
      .set('x-device', xDevice)
      .set('x-user', xUser)
      .set('x-guid', xGuid)
      .set('x-device-ip', xDeviceIp);
  }

  /** Obtiene todas las notas enviando las cabeceras requeridas */
  async getAllNotesWithHeaders(xDevice: string, xUser: string, xGuid: string): Promise<Note[]> {
    if (this.useLocalStorage) {
      console.log('📦 Obteniendo notas de Almacenamiento Local (Cifradas)');
      const encryptedData = await this._storage?.get('notes');
      if (!encryptedData) return [];
      
      const decryptedNotes = this.securityService.decrypt(encryptedData);
      return decryptedNotes || [];
    }

    const headers = this.buildRequiredHeaders(xDevice, xUser, xGuid);
    
    console.log('📤 Enviando petición GET a /api/notes con cabeceras:');
    headers.keys().forEach(key => {
      console.log(`  ${key}: ${headers.get(key)}`);
    });

    return firstValueFrom(
      this.httClient.get<Note[]>(this.API_URL_BASE + '/api/notes', { headers, observe: 'response' as const })
    ).then(response => {
      console.log('✅ Respuesta exitosa, status:', response.status);
      return response.body || [];
    }).catch(error => {
      console.error('❌ Error en la petición:', error);
      throw error;
    });
  }

  /** Obtiene una nota por su ID */
  async getNoteById(noteId: number, xDevice: string, xUser: string, xGuid: string): Promise<Note> {
    if (this.useLocalStorage) {
      const encryptedData = await this._storage?.get('notes');
      const notes = encryptedData ? this.securityService.decrypt(encryptedData) : [];
      const note = notes.find((n: Note) => n.noteId === noteId);
      if (!note) throw new Error('Nota no encontrada');
      return note;
    }

    const headers = this.buildRequiredHeaders(xDevice, xUser, xGuid);
    return firstValueFrom(
      this.httClient.get<Note>(this.API_URL_BASE + `/api/notes/${noteId}`, { headers })
    );
  }

  async createNote(data: Note, xDevice: string, xUser: string, xGuid: string): Promise<Note> {
    if (this.useLocalStorage) {
      console.log('📦 Guardando nota cifrada en Almacenamiento Local');
      const encryptedData = await this._storage?.get('notes');
      const notes = encryptedData ? this.securityService.decrypt(encryptedData) : [];
      
      if (!data.noteId) data.noteId = Date.now();
      notes.push(data);
      
      // Ciframos todo el array antes de guardarlo
      const encryptedNotes = this.securityService.encrypt(notes);
      await this._storage?.set('notes', encryptedNotes);
      return data;
    }

    const headers = this.buildRequiredHeaders(xDevice, xUser, xGuid);

    return firstValueFrom(
      this.httClient.post<Note>(this.API_URL_BASE + '/api/notes', data, { headers })
    ).then(response => {
      return response;
    }).catch(error => {
      console.error('❌ Error al crear la nota:', error);
      throw error;
    });
  }

  /** Actualiza una nota existente */
  async updateNote(data: Note, xDevice: string, xUser: string, xGuid: string, xDeviceIp: string = '127.0.0.1'): Promise<Note> {
    if (this.useLocalStorage) {
      console.log('� Actualizando nota en Almacenamiento Local');
      const encryptedData = await this._storage?.get('notes');
      const notes = encryptedData ? this.securityService.decrypt(encryptedData) : [];
      
      const index = notes.findIndex((n: Note) => n.noteId === data.noteId);
      if (index !== -1) {
        notes[index] = data;
        const encryptedNotes = this.securityService.encrypt(notes);
        await this._storage?.set('notes', encryptedNotes);
      }
      return data;
    }

    const headers = this.buildRequiredHeaders(xDevice, xUser, xGuid, xDeviceIp);
    return firstValueFrom(
      this.httClient.put<Note>(this.API_URL_BASE + `/api/notes/${data.noteId}`, data, { headers })
    );
  }

  /** Elimina una nota por su ID */
  async deleteNote(noteId: number, xDevice: string, xUser: string, xGuid: string): Promise<void> {
    if (this.useLocalStorage) {
      console.log('� Eliminando nota de Almacenamiento Local');
      const encryptedData = await this._storage?.get('notes');
      let notes = encryptedData ? this.securityService.decrypt(encryptedData) : [];
      
      notes = notes.filter((n: Note) => n.noteId !== noteId);
      const encryptedNotes = this.securityService.encrypt(notes);
      await this._storage?.set('notes', encryptedNotes);
      return;
    }

    const headers = this.buildRequiredHeaders(xDevice, xUser, xGuid);
    return firstValueFrom(
      this.httClient.delete<void>(this.API_URL_BASE + `/api/notes/${noteId}`, { headers })
    );
  }
}
