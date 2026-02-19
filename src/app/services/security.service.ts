import { inject, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private storage = inject(Storage);
  private _storage: Storage | null = null;
  private _masterKey: string | null = null;
  private readonly HASH_KEY = 'master_key_hash';

  constructor() {}

  /**
   * Inicializa la base de datos de almacenamiento.
   */
  async init() {
    if (this._storage) return;
    try {
      console.log('🔐 Iniciando Storage en SecurityService...');
      this._storage = await this.storage.create();
      console.log('✅ Storage inicializado correctamente.');
    } catch (e) {
      console.error('❌ Error inicializando Storage:', e);
    }
  }

  /**
   * Establece la clave maestra en memoria.
   */
  setMasterKey(key: string) {
    this._masterKey = key;
  }

  /**
   * Indica si la clave maestra está disponible en memoria.
   */
  isKeySet(): boolean {
    return !!this._masterKey;
  }

  /**
   * Verifica si ya existe una clave maestra configurada en el dispositivo.
   */
  async hasMasterKey(): Promise<boolean> {
    await this.init();
    const hash = await this._storage?.get(this.HASH_KEY);
    return !!hash;
  }

  /**
   * Configura la clave maestra por primera vez guardando un hash para validaciones futuras.
   */
  async setupMasterKey(key: string): Promise<void> {
    await this.init();
    const hash = CryptoJS.SHA256(key).toString();
    await this._storage?.set(this.HASH_KEY, hash);
    this._masterKey = key;
  }

  /**
   * Valida si la clave ingresada es correcta comparándola con el hash guardado.
   */
  async validateMasterKey(key: string): Promise<boolean> {
    await this.init();
    const savedHash = await this._storage?.get(this.HASH_KEY);
    const inputHash = CryptoJS.SHA256(key).toString();
    
    if (savedHash === inputHash) {
      this._masterKey = key;
      return true;
    }
    return false;
  }

  /**
   * Cifra un objeto o string usando la clave maestra en memoria.
   */
  encrypt(data: any): string {
    if (!this._masterKey) throw new Error('Clave maestra no configurada en memoria');
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, this._masterKey).toString();
  }

  /**
   * Descifra un string usando la clave maestra en memoria.
   */
  decrypt(encryptedData: string): any {
    if (!this._masterKey) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this._masterKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData ? JSON.parse(decryptedData) : null;
    } catch (error) {
      console.error('Error al descifrar:', error);
      return null;
    }
  }
}
