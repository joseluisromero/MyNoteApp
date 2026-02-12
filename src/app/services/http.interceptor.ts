import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🔍 [HttpInterceptor] Petición interceptada:');
    console.log('  URL:', request.url);
    console.log('  Method:', request.method);
    console.log('  Headers:');
    
    // Log de todas las cabeceras
    request.headers.keys().forEach(key => {
      const value = request.headers.get(key);
      console.log(`    ${key}: ${value}`);
    });

    return next.handle(request).pipe(
      tap(
        event => {
          console.log('✅ [HttpInterceptor] Respuesta recibida:', event);
        },
        error => {
          console.error('❌ [HttpInterceptor] Error en la petición:', error.message);
        }
      )
    );
  }
}
