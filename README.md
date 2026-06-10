# Selene Salud - Sistema de gestión hospitalaria integral

¡Bienvenido al repositorio central de **Selene Salud**! Este proyecto representa una plataforma ecosistémica de salud digital diseñada para la optimización de servicios médicos, la gestión automatizada de agendas clínicas y la auditoría segura de historiales clínicos en tiempo real.

El proyecto está estructurado bajo una arquitectura modular desacoplada y dividida en tres componentes principales independientes que interactúan de forma síncrona.

---

## Despliegues y enlaces oficiales

Para facilitar la evaluación y auditoría del sistema, los componentes web y de servidor se encuentran desplegados en entornos de producción de acceso público:

* **API Backend (Servidor):** [Desplegado en Render](https://tu-url-de-render.onrender.com/api)
* **Panel administrativo y médico (Frontend Web):** [Acceder a la Web en Netlify](https://scintillating-sunburst-f4de07.netlify.app/)
* **Persistencia de datos (Base de datos):** PostgreSQL en entorno Serverless de [Neon.tech](https://neon.tech).

---

## Arquitectura y componentes del sistema

### 1. Backend (API RESTful)
El núcleo inteligente del ecosistema. Una API robusta construida sobre **Node.js** y **Express**, conectada a una base de datos relacional distribuida en la nube (**PostgreSQL**).
* **Seguridad y LOPD:** Autenticación y autorización mediante cifrado asimétrico basado en **Tokens JWT (JSON Web Tokens)** con hashing de contraseñas de alta seguridad mediante **Bcrypt**.
* **Control de Accesos:** Middleware personalizado para la interceptación y validación estricta de roles operativos (`ADMIN`, `MEDICO`, `PACIENTE`).
* **Integridad Transaccional:** Control de concurrencia y mutaciones mediante bloques transaccionales nativos en SQL (`BEGIN`, `COMMIT`, `ROLLBACK`) para operaciones críticas de facturación e informes médicos.
* **Estado:** 🟢 100% operativo y desplegado en **Render**.

### 2. Frontend Web (Gestión y clínica)
Panel de control adaptativo (Single Page Application) desarrollado en **Angular (v17+)** destinado al personal de administración y facultativos sanitarios.
* **Módulo de Administración:** Alta de profesionales, gobernanza de centros de salud y vinculación relacional dinámica en base de datos.
* **Módulo Médico:** Gestión cronológica de la agenda diaria del facultativo, motor de apertura y fragmentación de turnos horarios, y módulo de atención clínica con guardado inmediato de informes en el expediente.
* **Estado:** 🟢 100% operativo y desplegado en **Netlify**.

### 3. Aplicación Móvil (Portal del paciente)
Aplicación nativa de alto rendimiento desarrollada en **Android nativo utilizando Kotlin**. Diseñada bajo los estándares visuales de Material Design 3, interactúa con el servidor mediante corrutinas y programación reactiva asíncrona.
* **Sincronización de red:** Consumo de recursos REST mediante el cliente HTTP **Retrofit 2** y serialización/mapeo estricto de datos con **Gson**.
* **Funcionalidades clave implementadas:**
    * *Autenticación segura:* Login nativo con persistencia de sesión cifrada en `SharedPreferences`.
    * *Motor de agendación:* Sistema interactivo de reserva de citas médicas filtrado por centro, con control preventivo de colisiones horarias.
    * *Panel "Mis citas":* Gestión en vivo del ciclo de vida de la cita (Vigente/Completada/Anulada) mediante mapeo de estados dinámicos (`when` en Kotlin).
    * *Expediente clínico:* Descarga y visualización cronológica del historial médico oficial con un **motor de búsqueda y filtrado local en tiempo real** por diagnóstico o fármaco prescrito.
* **Próxima Implementación:** Pasarela de pagos integrada para centros privados simulada mediante el SDK oficial de **Stripe API**.
* **Estado:** 🟢 Funcionalidades core completadas.

---

## Instrucciones de instalación local

### Requisitos previos
* **Node.js** (Versión 20+ recomendada)
* **Angular CLI** (Instalado globalmente si se desea compilar la web de forma local)
* **Android Studio** (Koala o superior para la edición y despliegue del cliente móvil)

### 1. Configuración del Backend
1. Entra en la carpeta del servidor: `cd backend`
2. Instala el árbol de dependencias oficiales: `npm install`
3. Crea un archivo de entorno `.env` en la raíz de la carpeta basado en la siguiente plantilla:
   ```env
   DATABASE_URL=tu_cadena_de_conexion_postgresql_neon
   JWT_SECRET=tu_clave_secreta_para_firmar_tokens_jwt
   PORT=3000
4. Levanta el servidor en modo desarrollo: npm start (o node app.js)

### 2. Configuración del Frontend Web (Angular)
1. Entra en la carpeta del proyecto web: cd frontend
2. Descarga los paquetes de nodos: npm install
3. Ejecuta el servidor de desarrollo local: ng serve
4. Abre tu navegador web en: http://localhost:4200

### 3. Configuración de la aplicación móvil (Android)
1. Abre Android Studio.
2. Selecciona File > Open y apunta al directorio de la carpeta de la aplicación móvil.
3. Deja que Gradle descargue las dependencias y sincronice el proyecto (Sync Project with Gradle Files).
4. Selecciona un dispositivo virtual (AVD Emulator) o un terminal físico con la depuración USB activa.
5. Haz clic en el botón Run (Shift + F10) para compilar e instalar la aplicación en el dispositivo.