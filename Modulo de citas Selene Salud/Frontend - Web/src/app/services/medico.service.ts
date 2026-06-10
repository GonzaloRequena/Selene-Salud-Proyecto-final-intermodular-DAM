import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Importamos el entorno

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  // RUTA LOCAL (Comentada para trabajar de forma local)
  // private apiUrl = 'http://localhost:3000/api'; 

  // RUTA DINÁMICA (Descomentada para producción / Netlify + Render)
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Helper para obtener las cabeceras de autorización con el Token JWT
   */
  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('selene_token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * GET /api/citas/mis-citas
   * Obtiene la lista de pacientes agendados para el médico autenticado
   */
  obtenerMisCitas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/citas/mis-citas`, { headers: this.obtenerHeaders() });
  }

  /**
   * GET /api/medicos-centros/medico/:id_medico
   * Obtiene los centros asignados al médico para que pueda elegir dónde abrir agenda
   */
  obtenerMisCentros(idMedico: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/medicos-centros/medico/${idMedico}`, { headers: this.obtenerHeaders() });
  }

  /**
   * POST /api/disponibilidad
   * Publica un bloque horario de turnos en un centro de salud
   */
  crearDisponibilidad(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/disponibilidad`, datos, { headers: this.obtenerHeaders() });
  }

  /**
   * POST /api/informes
   * Guarda el diagnóstico clínico del paciente y cierra la cita
   */
  crearInforme(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/informes`, datos, { headers: this.obtenerHeaders() });
  }

  // GET /api/informes/paciente/:id_paciente
  obtenerHistorialPaciente(idPaciente: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/informes/paciente/${idPaciente}`);
}
}