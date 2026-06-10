import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Helper privado para generar las cabeceras con el Token JWT del Admin
   */
  private obtenerCabeceras(): HttpHeaders {
    const token = localStorage.getItem('selene_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // 1. Obtener todos los médicos (Ruta protegida)
  obtenerMedicos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/medicos`, { headers: this.obtenerCabeceras() });
  }

  // 2. Obtener todos los centros médicos (Ruta pública/abierta)
  obtenerCentros(): Observable<any> {
    return this.http.get(`${this.apiUrl}/centros`);
  }

  // 3. Registrar un nuevo usuario (Médico o Admin)
  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/registro`, usuario);
  }

  // 4. Vincular un médico a un centro de salud (Ruta protegida)
  vincularMedicoCentro(id_medico: number, id_centro: number): Observable<any> {
    const body = { id_medico, id_centro };
    return this.http.post(`${this.apiUrl}/medicos-centros`, body, { headers: this.obtenerCabeceras() });
  }

  // 5. Obtener todas las citas médicas (Ruta protegida)
  obtenerTodasCitas(): Observable<any> {
    // Atacamos al endpoint dinámico. El interceptor se encargará de mandar el token de ADMIN
    return this.http.get<any>(`${this.apiUrl}/citas/mis-citas`);
  }

  // 6. Obtener el historial clínico de un paciente por su ID (Ruta protegida)
  obtenerHistorialPaciente(idPaciente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/informes/paciente/${idPaciente}`);
  }
}