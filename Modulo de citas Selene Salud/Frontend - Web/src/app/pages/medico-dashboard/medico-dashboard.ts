import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoService } from '../../services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico-dashboard.html',
  styleUrl: './medico-dashboard.css'
})
export class MedicoDashboard implements OnInit {
  // Control de pestañas del Panel
  pestanaActiva: string = 'citas'; // Puede ser: 'citas', 'agenda' o 'informes'
  
  // Datos del médico logueado
  medicoId!: number;
  medicoNombre: string = '';

  // Listados cargados de la base de datos
  listaCitas: any[] = [];
  listaCentros: any[] = [];

  // Estado visual: Controla si la tabla de consultas finalizadas está encogida
  historialColapsado: boolean = false;

  // ==========================================
  // VARIABLES PARA EL BUSCADOR DE INFORMES
  // ==========================================
  busquedaPaciente: string = '';      // Texto que escribe el médico en el buscador
  pacienteSeleccionado: any = null;   // Almacena el paciente del que estamos viendo el historial
  historialClinico: any[] = [];       // Informes médicos devueltos por Neon

  // Getters reactivos para filtrar las citas en tiempo real
  get citasPendientes(): any[] {
    return this.listaCitas.filter(cita => cita.estado === 'PROGRAMADA');
  }

  get citasFinalizadas(): any[] {
    return this.listaCitas.filter(cita => cita.estado === 'COMPLETADA' || cita.estado === 'ANULADA');
  }

  // Listado único de pacientes con los que el médico tiene o ha tenido cita hoy para poder seleccionarlos
  get pacientesDisponibles(): any[] {
    const mapa = new Map();
    this.listaCitas.forEach(cita => {
      if (cita.id_paciente) {
        mapa.set(cita.id_paciente, {
          id: cita.id_paciente,
          nombre: cita.paciente_nombre,
          apellidos: cita.paciente_apellidos,
          telefono: cita.paciente_telefono || 'No disponible'
        });
      }
    });
    
    const lista = Array.from(mapa.values());
    if (!this.busquedaPaciente.trim()) return lista;
    
    // Filtrado por Nombre o Apellidos en el buscador
    return lista.filter(p => 
      `${p.nombre} ${p.apellidos}`.toLowerCase().includes(this.busquedaPaciente.toLowerCase())
    );
  }

  // Objeto para crear bloques de disponibilidad (Mi Agenda)
  nuevaDisponibilidad = {
    id_centro: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    duracion_minutos: 15
  };

  // Estado para la ventana de "Atender Paciente" (Redactar Informe)
  citaSeleccionada: any = null; 
  nuevoInforme = {
    id_cita: '',
    id_paciente: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: ''
  };

  constructor(
    private medicoService: MedicoService,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit(): void {
    console.log("🚀 Iniciando MédicoDashboard...");
    
    // Cambiamos 'usuario' por 'selene_usuario'
    const usuarioString = localStorage.getItem('selene_usuario');
    
    if (usuarioString) {
      const usuarioObjeto = JSON.parse(usuarioString);
      console.log("📦 [DEBUG] Contenido de selene_usuario:", usuarioObjeto);
      
      // Extraemos el ID de forma segura según cómo venga estructurado
      this.medicoId = usuarioObjeto.id || (usuarioObjeto.usuario ? usuarioObjeto.usuario.id : undefined);
      this.medicoNombre = usuarioObjeto.nombre || (usuarioObjeto.usuario ? usuarioObjeto.usuario.nombre : 'Médico');
      
      console.log("🆔 [DEBUG] ID extraído con éxito:", this.medicoId);
    } else {
      console.error("❌ Error grave: No existe la clave 'selene_usuario' en el LocalStorage.");
    }

    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    console.log("🔍 [DEBUG] El ID del médico recuperado es:", this.medicoId);

    // 1. Petición de Citas
    this.medicoService.obtenerMisCitas().subscribe({
      next: (res) => {
        console.log("📅 [DEBUG] Respuesta de Citas recibida:", res);
        this.listaCitas = res.citas || res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("❌ Error al cargar tus citas médicas", err)
    });

    // 2. Petición de Centros con control estricto
    if (this.medicoId) {
      console.log("✈️ [DEBUG] Lanzando petición de centros para el ID:", this.medicoId);
      
      this.medicoService.obtenerMisCentros(this.medicoId).subscribe({
        next: (res) => {
          console.log("🏥 [DEBUG] ¡Backend respondió! Datos de centros:", res);
          // Tu controlador devuelve { centros: [...] }, accedemos de forma segura
          this.listaCentros = res.centros ? res.centros : (Array.isArray(res) ? res : []);
          console.log("📊 [DEBUG] Array final asignado a listaCentros:", this.listaCentros);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("❌ Error crítico al cargar tus centros asignados:", err);
        }
      });
    } else {
      console.warn("⚠️ [DEBUG] Ojo: No se buscan centros porque 'this.medicoId' es inválido o nulo.");
    }
  }

  ejecutarCrearAgenda() {
    if (!this.nuevaDisponibilidad.id_centro || !this.nuevaDisponibilidad.fecha || !this.nuevaDisponibilidad.hora_inicio || !this.nuevaDisponibilidad.hora_fin) {
      Swal.fire('Campos vacíos', 'Por favor, define el centro, fecha y rango de horas de consulta.', 'warning');
      return;
    }

    const payload = {
      ...this.nuevaDisponibilidad,
      id_centro: Number(this.nuevaDisponibilidad.id_centro)
    };

    this.medicoService.crearDisponibilidad(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: '¡Agenda Publicada!',
          text: 'Los bloques de tiempo se han generado con éxito.',
          confirmButtonColor: '#0d6efd'
        });
        this.nuevaDisponibilidad = { id_centro: '', fecha: '', hora_inicio: '', hora_fin: '', duracion_minutos: 15 };
        this.cargarDatosIniciales();
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Error de Agenda', text: err.error?.error || 'No se pudo registrar la franja horaria.' });
      }
    });
  }

  abrirModoConsulta(cita: any) {
    this.citaSeleccionada = cita;
    this.nuevoInforme = {
      id_cita: cita.cita_id || cita.id,
      id_paciente: cita.id_paciente, 
      diagnostico: '',
      tratamiento: '',
      observaciones: ''
    };
    this.cdr.detectChanges();
  }

  ejecutarGuardarInforme() {
    if (!this.nuevoInforme.diagnostico.trim() || !this.nuevoInforme.tratamiento.trim()) {
      Swal.fire('Informe incompleto', 'El Diagnóstico y Tratamiento son obligatorios por ley clínica.', 'warning');
      return;
    }

    this.medicoService.crearInforme(this.nuevoInforme).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Cita Finalizada',
          text: 'El informe clínico se ha registrado correctamente en Neon.',
          confirmButtonColor: '#198754'
        });
        
        this.citaSeleccionada = null;
        this.cargarDatosIniciales(); 
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Error al cerrar consulta', text: err.error?.error || 'No se pudo guardar el informe médico.' });
      }
    });
  }

  // ==========================================
  // LÓGICA LOGÍSTICA DE HISTORIAL DE INFORMES
  // ==========================================
  seleccionarPaciente(paciente: any) {
    this.pacienteSeleccionado = paciente;
    this.medicoService.obtenerHistorialPaciente(paciente.id).subscribe({
      next: (res) => {
        // Mapeamos el array que nos manda tu controlador (res.historial)
        this.historialClinico = res.historial || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo descargar el expediente de Neon.', 'error');
      }
    });
  }

  volverAlBuscador() {
    this.pacienteSeleccionado = null;
    this.historialClinico = [];
  }
}