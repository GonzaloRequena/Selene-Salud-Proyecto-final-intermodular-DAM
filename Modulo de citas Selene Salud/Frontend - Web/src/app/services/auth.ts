import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Importamos las URLs de entorno
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Leemos la URL base (en local será localhost:3000 y en Netlify será la de Render automáticamente)
  private apiUrl = environment.apiUrl;

  // SIGNAL GLOBAL: Almacena el objeto del usuario logueado (id, nombre, rol...) o null si no hay sesión
  usuarioLogueado = signal<any | null>(null);

  constructor(private http: HttpClient) {
    // Cada vez que el usuario refresque la pestaña, comprobamos si ya tenía una sesión activa
    this.cargarSesionExistente();
  }

  /**
   * Método para iniciar sesión conectando con el endpoint del Backend
   * POST /api/usuarios/login
   */
  login(credenciales: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/login`, credenciales).pipe(
      tap(respuesta => {
        // Si la API responde con éxito, guardamos el Token y los datos en el almacenamiento del navegador
        localStorage.setItem('selene_token', respuesta.token);
        localStorage.setItem('selene_usuario', JSON.stringify(respuesta.usuario));

        // Actualizamos nuestra Signal global. Todos los componentes de la web se enterarán al instante
        this.usuarioLogueado.set(respuesta.usuario);
      })
    );
  }

  /**
   * Método para cerrar sesión de forma limpia
   */
  logout() {
    localStorage.removeItem('selene_token');
    localStorage.removeItem('selene_usuario');
    
    // Reseteamos la Signal a null (los menús de Admin/Médico desaparecerán solos)
    this.usuarioLogueado.set(null);
  }

  /**
   * Obtiene de forma rápida el token JWT para cuando tengamos que hacer peticiones protegidas
   */
  obtenerToken(): string | null {
    return localStorage.getItem('selene_token');
  }

  /**
   * Comprobación interna para mantener al usuario dentro del sistema al recargar la página
   */
  private cargarSesionExistente() {
    const usuarioGuardado = localStorage.getItem('selene_usuario');
    const tokenGuardado = localStorage.getItem('selene_token');

    if (usuarioGuardado && tokenGuardado) {
      // Si existen las cookies locales, rellenamos la signal directamente
      this.usuarioLogueado.set(JSON.parse(usuarioGuardado));
    }
  }
}