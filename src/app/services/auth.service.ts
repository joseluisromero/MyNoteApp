import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private securityService = inject(SecurityService);
  private router = inject(Router);

  /**
   * Verifica si el usuario está autorizado.
   * Si no, lo redirige a la página de autenticación de seguridad.
   */
  async ensureAuthorized(): Promise<boolean> {
    console.log('📡 AuthService: Verificando autorización...');

    if (this.securityService.isKeySet()) {
      console.log('✅ AuthService: Autorizado (Sesión Activa).');
      return true;
    }

    // Si no está autorizado, lo mandamos a la página de seguridad
    console.warn('⚠️ AuthService: No autorizado. Redirigiendo a /security-auth');
    this.router.navigate(['/security-auth']);
    return false;
  }
}
