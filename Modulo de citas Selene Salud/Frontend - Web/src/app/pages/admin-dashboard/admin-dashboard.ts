import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { LanguageService } from '../../services/language.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  // Control de la interfaz
  pestanaActiva: string = 'personal'; // Puede ser: 'personal', 'centros', 'citas', 'informes'
  filtroCentro: string = '';          // Texto del buscador de centros
  centroSeleccionado: any = null;     // Guarda el centro que clickee el Admin

  // Listados de Neon
  listaMedicos: any[] = [];
  listaCentros: any[] = [];
  listaCitas: any[] = [];

  // ==========================================
  // NUEVAS VARIABLES PARA AUDITORÍA DE INFORMES
  // ==========================================
  busquedaPaciente: string = '';
  pacienteSeleccionado: any = null;
  historialClinico: any[] = [];

  // Obtener lista única de pacientes a partir de las citas globales para poder buscar
  get pacientesGlobales(): any[] {
    const mapa = new Map();
    this.listaCitas.forEach(cita => {
      // Usamos los campos que vienen en tu listado de citas de la auditoría
      if (cita.id_paciente || cita.paciente_id) {
        const idPac = cita.id_paciente || cita.paciente_id;
        mapa.set(idPac, {
          id: idPac,
          nombre: cita.paciente_nombre,
          apellidos: cita.paciente_apellidos,
          telefono: cita.paciente_telefono || 'No registrado'
        });
      }
    });

    const lista = Array.from(mapa.values());
    if (!this.busquedaPaciente.trim()) return lista;

    return lista.filter(p =>
      `${p.nombre} ${p.apellidos}`.toLowerCase().includes(this.busquedaPaciente.toLowerCase())
    );
  }

  // Objeto para registrar usuarios
  nuevoUsuario = {
    dni_nie: '',
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    rol: 'MEDICO'
  };

  // Objeto para vincular médico a centro
  vinculacion = {
    id_medico: '',
    id_centro: ''
  };

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef, public langService: LanguageService) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.adminService.obtenerMedicos().subscribe({
      next: (res) => {
        this.listaMedicos = res.medicos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error al cargar médicos", err)
    });

    this.adminService.obtenerCentros().subscribe({
      next: (res) => {
        this.listaCentros = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error al cargar centros", err)
    });

    this.adminService.obtenerTodasCitas().subscribe({
      next: (res) => {
        // Tu controlador responde con res.json({ citas: resultado.rows })
        this.listaCitas = res.citas;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error al cargar el historial de citas", err)
    });
  }

  // ==========================================
  // LÓGICA DE AUDITORÍA DE INFORMES
  // ==========================================
  seleccionarPaciente(paciente: any) {
    this.pacienteSeleccionado = paciente;
    this.adminService.obtenerHistorialPaciente(paciente.id).subscribe({
      next: (res) => {
        this.historialClinico = res.historial || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo obtener el historial clínico.', 'error');
      }
    });
  }

  volverAlBuscador() {
    this.pacienteSeleccionado = null;
    this.historialClinico = [];
  }

  /**
    * Filtra los centros en tiempo real por Nombre o Municipio de forma segura
    */
  obtenerCentrosFiltrados(): any[] {
    if (!this.filtroCentro.trim()) {
      return this.listaCentros;
    }
    const busqueda = this.filtroCentro.toLowerCase();
    return this.listaCentros.filter(centro => {
      const nombre = centro.nombre ? centro.nombre.toLowerCase() : '';
      // Buscamos dinámicamente en cualquier propiedad de ubicación que devuelva Neon
      const municipio = centro.municipio ? centro.municipio.toLowerCase() : '';
      const ciudad = centro.ciudad ? centro.ciudad.toLowerCase() : '';
      const localidad = centro.localidad ? centro.localidad.toLowerCase() : '';

      return nombre.includes(busqueda) ||
        municipio.includes(busqueda) ||
        ciudad.includes(busqueda) ||
        localidad.includes(busqueda);
    });
  }

  /**
   * Al hacer clic en un centro de la tabla, lo preparamos para vincularle un médico
   */
  seleccionarCentro(centro: any) {
    this.centroSeleccionado = centro;
    this.vinculacion.id_centro = centro.id; // Asigna automáticamente el ID
  }

  ejecutarRegistro() {
    this.adminService.registrarUsuario(this.nuevoUsuario).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: '¡Usuario Registrado!',
          text: `El ${this.nuevoUsuario.rol.toLowerCase()} ${res.nombre} se ha creado con éxito.`,
          confirmButtonColor: '#0d6efd'
        });

        if (this.nuevoUsuario.rol === 'MEDICO') {
          this.cargarDatosIniciales();
        }

        this.nuevoUsuario = { dni_nie: '', nombre: '', apellidos: '', email: '', password: '', telefono: '', rol: 'MEDICO' };
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Error al registrar', text: err.error?.error || 'Error' });
      }
    });
  }

  ejecutarVinculacion() {
    const idMed = Number(this.vinculacion.id_medico);
    const idCen = Number(this.vinculacion.id_centro);

    this.adminService.vincularMedicoCentro(idMed, idCen).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: '¡Asignación Exitosa!',
          text: `Médico vinculado a ${this.centroSeleccionado.nombre} correctamente.`,
          confirmButtonColor: '#0d6efd'
        });
        this.vinculacion.id_medico = '';
        this.centroSeleccionado = null; // Cerramos el panel de vinculación
        this.cargarDatosIniciales(); // Refrescamos para ver cambios
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Fallo en la asignación', text: err.error?.error || 'Error' });
      }
    });
  }
}