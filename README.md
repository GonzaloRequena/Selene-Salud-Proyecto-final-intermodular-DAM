# 🌙 Selene Salud - Sistema de Gestión Hospitalaria Integral

¡Bienvenido al repositorio central de **Selene Salud**! Este proyecto representa una plataforma ecosistémica diseñada para la digitalización y optimización de servicios médicos, gestión de agendas clínicas y auditoría de historiales clínicos en tiempo real.

El proyecto está diseñado bajo una arquitectura limpia y modular, dividida en tres componentes principales (Monorepo).

---

## 🛠️ Arquitectura y Componentes del Sistema

### 1. 🖥️ Backend
El núcleo del sistema. Una **API RESTful** robusta construida con **Node.js** y **Express**, conectada a una base de datos relacional en la nube (**PostgreSQL en Neon**). 
* **Seguridad:** Autenticación y autorización mediante Tokens **JWT (JSON Web Tokens)** con encriptación de contraseñas mediante **Bcrypt**.
* **Control de Accesos:** Middleware personalizado para la gestión estricta de roles (`ADMIN`, `MEDICO`, `PACIENTE`).
* **Estado:** 🟢 100% Operativo y Desplegado en **Render**.

### 2. 🌐 Frontend Web
Panel de control adaptativo desarrollado en **Angular (v17+)** destinado al personal de administración y facultativos sanitarios.
* **Módulo Admin:** Alta de médicos, centros de salud y vinculación dinámica en base de datos.
* **Módulo Médico:** Gestión de consultas cronológicas del día, módulo de atención clínica con guardado inmediato en Neon y un motor matemático de apertura y fragmentación de turnos horarios.
* **Estado:** 🟢 Funcionalidades locales validadas. Preparado para despliegue en **Netlify**.

### 3. 📱 Aplicación Móvil
Aplicación destinada al paciente final para la consulta de su historial clínico, descarga de informes de diagnóstico y reserva interactiva de turnos médicos generados por la plataforma.
* **Tecnología planificada:** Framework híbrido multiplataforma.
* **Estado:** 🟡 En fase de diseño conceptual y maquetación de pantallas.

---

## 🚀 Instrucciones de Instalación Local

### Requisitos previos
* Node.js (Versión 20 recomendada)
* Cuenta en Neon PostgreSQL (o base de datos local)

### Configuración del Backend
1. Entra en la carpeta: `cd backend`
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env` basado en tus credenciales de base de datos:
   ```env
   DATABASE_URL=tu_cadena_de_conexion_neon
   JWT_SECRET=tu_clave_secreta_jwt
   PORT=3000
4. Levanta el servidor: node app.js (o el script configurado)

### Configuración del Frontend
1. Entra en la carpeta: cd frontend
2. Instala las dependencias: npm install
3. Ejecuta el servidor de desarrollo de Angular: ng serve
4. Abre tu navegador en http://localhost:4200


