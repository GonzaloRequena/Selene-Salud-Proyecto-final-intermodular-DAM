import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router'; // Importaciones de enrutamiento del curso
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink], // Dejamos preparados los módulos de carga
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'Selene Salud';

  // Inyectamos el servicio de autenticación de forma pública para poder leer su Signal desde el HTML
  constructor(public authService: AuthService, private router: Router) {}

  /**
   * Método que ejecuta el botón "Salir" de la barra de navegación
   */
  ejecutarLogout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigimos de vuelta a la entrada
  }
}