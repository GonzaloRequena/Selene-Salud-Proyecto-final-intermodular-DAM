import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Obligatorio para leer datos de formularios de texto
import { AuthService } from '../../services/auth'; // Importamos el servicio de autenticación
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importamos la librería de alertas del curso

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Declaramos el uso de formularios
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  // Objeto enlazado bidireccionalmente al HTML mediante ngModel
  datosFormulario = {
    email: '',
    password: ''
  };

  // Inyectamos el servicio de autenticación y el enrutador de páginas
  constructor(private authService: AuthService, public langService: LanguageService, private router: Router, private zone: NgZone) { }

  ejecutarLogin() {
    // Validación básica visual previa
    if (!this.datosFormulario.email || !this.datosFormulario.password) {
      Swal.fire('Campos incompletos', 'Por favor, rellene todos los campos del formulario.', 'warning'); //
      return;
    }

    // Llamamos al método login del servicio y nos suscribimos según la estructura moderna
    this.authService.login(this.datosFormulario).subscribe({
      next: (respuesta) => {
        // Alerta de éxito con SweetAlert2
        Swal.fire({
          title: '¡Bienvenido al sistema!',
          text: `Sesión iniciada correctamente como ${respuesta.usuario.nombre}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        // Redirección inteligente según el rol que nos devuelva la base de datos
        this.zone.run(() => {
          if (respuesta.usuario.rol === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (respuesta.usuario.rol === 'MEDICO') {
            this.router.navigate(['/medico']);
          }
        });
      },
      error: (err) => {
        // Gestión estricta de errores con alertas Swal (Pág 26 de tus apuntes)
        console.error('Error de login:', err);
        const mensajeError = err.error?.error || 'No se ha podido conectar con el servidor central.';
        Swal.fire('Error de Acceso', mensajeError, 'error'); //
      }
    });
  }
}