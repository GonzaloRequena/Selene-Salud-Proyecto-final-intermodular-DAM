import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    // Idioma por defecto
    currentLang: string = 'es';

    // Diccionario centralizado de literales intermodulares
    private dictionary: any = {
        es: {
            // General / Navbar
            nav_admin: 'Panel Admin',
            nav_informes: 'Historial de informes',
            nav_agenda: 'Mi agenda',
            nav_conectado: 'CONECTADO',
            nav_logout: 'Cerrar sesión',

            // Pantalla de Login
            login_title: 'Selene',
            login_subtitle: 'Salud',
            login_badge: 'Panel de gestión interna hospitalaria',
            login_email: 'Correo electrónico',
            login_password: 'Contraseña',
            login_btn: 'Entrar al panel',
            login_copy: '© 2026 Selene Salud. Sistema de gestión de citas médicas.',
            login_author: 'Por Gonzalo Requena Eslava',

            // --- PANEL GLOBAL DE ADMINISTRACIÓN ---
            admin_title: 'Panel global de administración',
            admin_subtitle: 'Gestión operativa interna de la red de salud Selene Salud.',
            admin_tab_personal: 'Plantilla y altas',
            admin_tab_centros: 'Centros de salud',
            admin_tab_citas: 'Auditoría de citas',
            admin_tab_informes: 'Historial clínico global',

            // Pestaña Personal y Registro
            admin_reg_titulo: '➕ Registrar personal sanitario',
            admin_reg_nombre: 'Nombre',
            admin_reg_apellidos: 'Apellidos',
            admin_reg_dni: 'DNI / NIE',
            admin_reg_email: 'Correo electrónico',
            admin_reg_pass: 'Contraseña inicial',
            admin_reg_tel: 'Teléfono',
            admin_reg_rol: 'Rol del sistema',
            admin_rol_medico: 'Médico clínico',
            admin_rol_admin: 'Administrador',
            admin_btn_guardar: 'Guardar en el sistema',
            admin_lista_personal: 'Personal médico en activo',
            admin_medicos_tag: 'Médicos',
            admin_th_profesional: 'Profesional',
            admin_th_dni: 'DNI/NIE',
            admin_th_contacto: 'Contacto',
            admin_sin_medicos: 'No se detectan médicos cargados. Revisa la consola o crea uno nuevo arriba.',

            // Pestaña Centros de Salud
            admin_centros_buscador: 'Buscador de hospitales de España',
            admin_centros_placeholder: 'Escribe el nombre del centro o el municipio... (Ej: Virgen o Madrid)',
            admin_th_id: 'ID',
            admin_th_centro_nombre: 'Nombre del centro hospitalario',
            admin_th_municipio: 'Municipio',
            admin_th_accion: 'Acción',
            admin_desconocido: 'Desconocido',
            admin_btn_seleccionar: 'Seleccionar',
            admin_sin_centros: 'Ningún centro coincide con la búsqueda.',
            admin_vinculo_titulo: 'Vincular personal sanitario',
            admin_vinculo_desc: 'Vas a asignar un profesional médico para pasar consulta operativa en el siguiente centro:',
            admin_vinculo_municipio: 'Municipio:',
            admin_vinculo_elegir: 'Elegir médico disponible',
            admin_vinculo_default: '-- Elige un médico de la lista --',
            admin_btn_confirmar: 'Confirmar asignación',
            admin_btn_cancelar: 'Cancelar',
            admin_no_seleccion_titulo: 'Ningún centro seleccionado',
            admin_no_seleccion_desc: 'Haz clic en el botón "Seleccionar" de cualquier hospital de la tabla para gestionarlo o vincularle un médico.',

            // Pestaña Auditoría de Citas
            admin_citas_titulo: 'Supervisor de Citas Médicas Globales',
            admin_citas_tag: 'Citas en Sistema',
            admin_citas_vacio: 'No se registra ninguna cita médica en la base de datos de Neon actualmente.',
            admin_th_fecha_hora: 'Fecha y Hora',
            admin_th_paciente: 'Paciente',
            admin_th_medico_asig: 'Médico Asignado',
            admin_th_centro_sanit: 'Centro Sanitario',
            admin_th_estado_cita: 'Estado de Cita',

            // Pestaña Historial Clínico Global
            admin_inf_titulo: 'Buscador e inspector de historiales clínicos',
            admin_inf_desc: 'Acceso de auditoría de administración para Selene Salud. Filtra y selecciona un paciente.',
            admin_inf_placeholder: 'Buscar paciente por nombre o apellidos...',
            admin_th_paciente_id: 'ID Paciente',
            admin_th_nombre_completo: 'Nombre completo',
            admin_th_telefono: 'Teléfono',
            admin_th_auditoria: 'Auditoría',
            admin_btn_inspeccionar: 'Inspeccionar informes',
            admin_inf_vacio: 'No hay registros de pacientes concurrentes en el sistema.',
            admin_btn_volver_inspector: '⬅️ Volver al inspector global',
            admin_modo_auditoria: 'Modo auditoría de administración | ID: #',
            admin_informes_emitidos: 'Informes emitidos por el personal médico',
            admin_sin_informes_global: 'Este paciente no registra informes clínicos grabados en el sistema.',
            admin_fecha_atencion: 'Fecha de atención: ',
            admin_informe: 'Informe #',
            admin_diagnostico: 'Diagnóstico: ',
            admin_tratamiento: 'Tratamiento: ',
            admin_observaciones: 'Observaciones: ',
            admin_facultativo: 'Facultativo firmante:',

            // --- PANEL DEL PROFESIONAL SANITARIO (MÉDICO) ---
            medico_title: 'Panel del profesional sanitario',
            medico_welcome: 'Bienvenido/a, Dr/a.',
            medico_subtitle: 'Gestión de consultas en tiempo real.',
            medico_tab_citas: 'Consultas del día',
            medico_en_espera: 'En espera:',
            medico_tab_agenda: 'Apertura de agenda y turnos',
            medico_tab_informes: 'Historial de informes',

            // Cola de pacientes
            medico_cola_espera: 'Cola de pacientes en espera / Pendientes',
            medico_sin_pacientes_title: '¡Excelente! No tienes pacientes en la cola de espera.',
            medico_sin_pacientes_sub: 'Todas las citas asignadas han sido completadas con éxito.',
            medico_th_horario: 'Horario',
            medico_th_paciente: 'Paciente',
            medico_th_centro: 'Centro sanitario',
            medico_th_estado: 'Estado',
            medico_th_accion: 'Acción Clínica',
            medico_btn_atender: 'Atender paciente',
            medico_hs: 'Hs',

            // Historial consultas procesadas
            medico_historial_mostrar: '➕ Mostrar Historial de consultas procesadas / Cerradas',
            medico_historial_ocultar: '➖ Ocultar Historial de consultas procesadas / Cerradas',
            medico_th_estado_final: 'Estado Final',
            medico_th_accion_corta: 'Acción',
            medico_btn_cerrado: 'Registro cerrado',

            // Buscador e Historial Clínico Paciente
            medico_buscador_titulo: 'Buscador global de pacientes asignados',
            medico_buscador_placeholder: 'Escribe el nombre o apellidos del paciente para filtrar...',
            medico_th_codigo: 'Código ID',
            medico_th_nombre_completo: 'Nombre completo',
            medico_th_telefono: 'Teléfono de contacto',
            medico_th_acceso: 'Acceso técnico',
            medico_btn_ver_historial: 'Ver historial clínico',
            medico_no_resultados: 'No se encontraron pacientes que coincidan con la búsqueda.',
            medico_btn_volver_buscador: '⬅️ Volver al buscador de expedientes',
            medico_encriptado: 'Expediente clínico encriptado',
            medico_paciente_id_lbl: 'ID de paciente:',
            medico_telefono_lbl: 'Teléfono:',
            medico_linea_evolucion: 'Línea de tiempo de evolución clínica',
            medico_total: 'Total:',
            medico_sin_informes: 'Este paciente no registra informes clínicos previos en Selene Salud.',
            medico_atendido_el: 'Atendido el:',
            medico_informe_num: 'Informe #',
            medico_diagnostico_lbl: 'Diagnóstico:',
            medico_tratamiento_lbl: 'Tratamiento prescrito:',
            medico_observaciones_lbl: 'Observaciones:',
            medico_emitido_por: 'Emitido por:',

            // Consulta Activa
            medico_paciente_consulta: '👤 Paciente en consulta',
            medico_historial_activo: 'Historial clínico digital activo',
            medico_cita_id_lbl: 'Cita ID:',
            medico_centro_lbl: 'Centro:',
            medico_fecha_hora_lbl: 'Fecha/Hora:',
            medico_btn_suspender: 'Suspender consulta / Volver',
            medico_datos_clinicos_title: 'Entrada de datos clínicos e informe de alta',
            medico_form_diagnostico: '1. Diagnóstico clínico principal *',
            medico_form_diagnostico_ph: 'Ej: Faringoamigdalitis aguda bacteriana...',
            medico_form_tratamiento: '2. Tratamiento y receta electrónica *',
            medico_form_tratamiento_ph: 'Ej: Amoxicilina 850mg cada 8 horas...',
            medico_form_observaciones: '3. Recomendaciones y observaciones generales',
            medico_form_observaciones_ph: 'Ej: Reposo relativo durante 48 horas...',
            medico_btn_registrar: 'Registrar informe y cerrar ficha clínica',

            // Gestión de Agenda
            medico_agenda_publicar: 'Publicar franja de consulta',
            medico_agenda_selecciona_centro: 'Selecciona el centro médico',
            medico_agenda_centro_default: '-- Elige uno de tus centros asignados --',
            medico_agenda_fecha: 'Fecha de consulta',
            medico_agenda_inicio: 'Hora de inicio',
            medico_agenda_fin: 'Hora de fin',
            medico_agenda_duracion: 'Duración estimada por paciente',
            medico_minutos: 'minutos',
            medico_minutos_recomendado: 'minutos (Recomendado)',
            medico_btn_generar_bloques: 'Generar bloques de disponibilidad',
            medico_ayuda_titulo: '⚙️ ¿Cómo funciona la generación automática de turnos?',
            medico_ayuda_p1: 'Cuando pulsas el botón, el backend toma tu rango horario completo y realiza una segmentación matemática automática en la base de datos de Neon.',
            medico_ayuda_li1_title: 'Protección de identidad:',
            medico_ayuda_li1_desc: ' La API inyecta tu ID de usuario de forma segura mediante el token. No puedes suplantar el horario de otro médico.',
            medico_ayuda_li2_title: 'Mapeo de intervalos:',
            medico_ayuda_li2_desc: ' Si abres de 09:00 a 10:00 con intervalos de 15 minutos, el sistema generará automáticamente 4 huecos independientes listos para que los pacientes los reserven desde la aplicación móvil.',
            medico_ayuda_li3_title: 'Centros asignados:',
            medico_ayuda_li3_desc: ' Solo aparecen en tu lista los centros médicos con los que el Administrador te ha vinculado formalmente desde el panel global.'
        },
        en: {
            // General / Navbar
            nav_admin: 'Admin panel',
            nav_informes: 'Reports history',
            nav_agenda: 'My agenda',
            nav_conectado: 'CONNECTED',
            nav_logout: 'Sign out',

            // Pantalla de Login
            login_title: 'Selene',
            login_subtitle: 'Salud',
            login_badge: 'Hospital internal management panel',
            login_email: 'Email address',
            login_password: 'Password',
            login_btn: 'Login to panel',
            login_copy: '© 2026 Selene Salud. Appointment management system.',
            login_author: 'By Gonzalo Requena Eslava',

            // --- GLOBAL ADMINISTRATION PANEL ---
            admin_title: 'Global administration panel',
            admin_subtitle: 'Internal operational management of the Selene Salud health network.',
            admin_tab_personal: 'Staff & registrations',
            admin_tab_centros: 'Health centers',
            admin_tab_citas: 'Appointment audit',
            admin_tab_informes: 'Global medical history',

            // Personal Tab & Registration
            admin_reg_titulo: '➕ Register healthcare staff',
            admin_reg_nombre: 'First Name',
            admin_reg_apellidos: 'Surnames',
            admin_reg_dni: 'DNI / NIE',
            admin_reg_email: 'Email address',
            admin_reg_pass: 'Initial password',
            admin_reg_tel: 'Phone',
            admin_reg_rol: 'System role',
            admin_rol_medico: 'Clinical doctor',
            admin_rol_admin: 'Administrator',
            admin_btn_guardar: 'Save to system',
            admin_lista_personal: 'Active medical staff',
            admin_medicos_tag: 'Doctors',
            admin_th_profesional: 'Professional',
            admin_th_dni: 'DNI/NIE',
            admin_th_contacto: 'Contact',
            admin_sin_medicos: 'No loaded doctors detected. Check the console or create a new one above.',

            // Centers Tab
            admin_centros_buscador: 'Spain hospitals search engine',
            admin_centros_placeholder: 'Type the center name or municipality... (E.g., Virgen or Madrid)',
            admin_th_id: 'ID',
            admin_th_centro_nombre: 'Hospital center name',
            admin_th_municipio: 'Municipality',
            admin_th_accion: 'Action',
            admin_desconocido: 'Unknown',
            admin_btn_seleccionar: 'Select',
            admin_sin_centros: 'No center matches the search.',
            admin_vinculo_titulo: 'Link healthcare staff',
            admin_vinculo_desc: 'You are going to assign a medical professional to perform operational consultations at the following center:',
            admin_vinculo_municipio: 'Municipality:',
            admin_vinculo_elegir: 'Choose available doctor',
            admin_vinculo_default: '-- Choose a doctor from the list --',
            admin_btn_confirmar: 'Confirm assignment',
            admin_btn_cancelar: 'Cancel',
            admin_no_seleccion_titulo: 'No center selected',
            admin_no_seleccion_desc: 'Click on the "Select" button of any hospital in the table to manage it or link a doctor to it.',

            // Appointments Tab
            admin_citas_titulo: 'Global Medical Appointment Supervisor',
            admin_citas_tag: 'Appointments in System',
            admin_citas_vacio: 'There are currently no medical appointments recorded in the Neon database.',
            admin_th_fecha_hora: 'Date and Time',
            admin_th_paciente: 'Patient',
            admin_th_medico_asig: 'Assigned Doctor',
            admin_th_centro_sanit: 'Healthcare Center',
            admin_th_estado_cita: 'Appointment Status',

            // Global Medical History Tab
            admin_inf_titulo: 'Medical history search & inspector',
            admin_inf_desc: 'Administration audit access for Selene Salud. Filter and select a patient.',
            admin_inf_placeholder: 'Search patient by name or surnames...',
            admin_th_paciente_id: 'Patient ID',
            admin_th_nombre_completo: 'Full name',
            admin_th_telefono: 'Phone',
            admin_th_auditoria: 'Audit',
            admin_btn_inspeccionar: 'Inspect reports',
            admin_inf_vacio: 'There are no concurrent patient records in the system.',
            admin_btn_volver_inspector: '⬅️ Back to global inspector',
            admin_modo_auditoria: 'Administration audit mode | ID: #',
            admin_informes_emitidos: 'Reports issued by medical staff',
            admin_sin_informes_global: 'This patient has no clinical reports recorded in the system.',
            admin_fecha_atencion: 'Attendance date:',
            admin_informe: 'Report #',
            admin_diagnostico: 'Diagnosis:',
            admin_tratamiento: 'Treatment:',
            admin_observaciones: 'Observations:',
            admin_facultativo: 'Signing clinician:',

            // --- HEALTHCARE PROFESSIONAL PANEL (DOCTOR) ---
            medico_title: 'Healthcare professional panel',
            medico_welcome: 'Welcome, Dr.',
            medico_subtitle: 'Real-time consultation management.',
            medico_tab_citas: 'Daily consultations',
            medico_en_espera: 'Waiting:',
            medico_tab_agenda: 'Agenda opening & shifts',
            medico_tab_informes: 'Reports history',

            // Patient Queue
            medico_cola_espera: 'Patient queue waiting / Pending',
            medico_sin_pacientes_title: 'Excellent! You have no patients in the waiting queue.',
            medico_sin_pacientes_sub: 'All assigned appointments have been successfully completed.',
            medico_th_horario: 'Time',
            medico_th_paciente: 'Patient',
            medico_th_centro: 'Healthcare center',
            medico_th_estado: 'Status',
            medico_th_accion: 'Clinical Action',
            medico_btn_atender: 'Attend patient',
            medico_hs: 'Hs',

            // Processed history
            medico_historial_mostrar: '➕ Show History of processed / Closed consultations',
            medico_historial_ocultar: '➖ Hide History of processed / Closed consultations',
            medico_th_estado_final: 'Final Status',
            medico_th_accion_corta: 'Action',
            medico_btn_cerrado: 'Record closed',

            // Search & Patient Medical History
            medico_buscador_titulo: 'Global search for assigned patients',
            medico_buscador_placeholder: 'Type the patient\'s name or surname to filter...',
            medico_th_codigo: 'ID Code',
            medico_th_nombre_completo: 'Full name',
            medico_th_telefono: 'Contact phone',
            medico_th_acceso: 'Technical access',
            medico_btn_ver_historial: 'View medical history',
            medico_no_resultados: 'No patients found matching the search.',
            medico_btn_volver_buscador: '⬅️ Back to medical record search',
            medico_encriptado: 'Encrypted medical record',
            medico_paciente_id_lbl: 'Patient ID:',
            medico_telefono_lbl: 'Phone:',
            medico_linea_evolucion: 'Clinical evolution timeline',
            medico_total: 'Total:',
            medico_sin_informes: 'This patient has no previous clinical reports recorded in Selene Salud.',
            medico_atendido_el: 'Attended on:',
            medico_informe_num: 'Report #',
            medico_diagnostico_lbl: 'Diagnosis:',
            medico_tratamiento_lbl: 'Prescribed treatment:',
            medico_observaciones_lbl: 'Observations:',
            medico_emitido_por: 'Issued by:',

            // Active Consultation
            medico_paciente_consulta: '👤 Patient in consultation',
            medico_historial_activo: 'Active digital medical history',
            medico_cita_id_lbl: 'Appointment ID:',
            medico_centro_lbl: 'Center:',
            medico_fecha_hora_lbl: 'Date/Time:',
            medico_btn_suspender: 'Suspend consultation / Go back',
            medico_datos_clinicos_title: 'Clinical data entry & discharge report',
            medico_form_diagnostico: '1. Main clinical diagnosis *',
            medico_form_diagnostico_ph: 'E.g., Acute bacterial pharyngotonsillitis...',
            medico_form_tratamiento: '2. Treatment and electronic prescription *',
            medico_form_tratamiento_ph: 'E.g., Amoxicillin 850mg every 8 hours...',
            medico_form_observaciones: '3. Recommendations and general observations',
            medico_form_observaciones_ph: 'E.g., Relative rest for 48 hours...',
            medico_btn_registrar: 'Register report and close clinical file',

            // Agenda Management
            medico_agenda_publicar: 'Publish consultation slot',
            medico_agenda_selecciona_centro: 'Select the medical center',
            medico_agenda_centro_default: '-- Choose one of your assigned centers --',
            medico_agenda_fecha: 'Consultation date',
            medico_agenda_inicio: 'Start time',
            medico_agenda_fin: 'End time',
            medico_agenda_duracion: 'Estimated duration per patient',
            medico_minutos: 'minutes',
            medico_minutos_recomendado: 'minutes (Recommended)',
            medico_btn_generar_bloques: 'Generate availability blocks',
            medico_ayuda_titulo: '⚙️ How does automatic shift generation work?',
            medico_ayuda_p1: 'When you click the button, the backend takes your complete time range and performs an automatic mathematical segmentation in the Neon database.',
            medico_ayuda_li1_title: 'Identity protection:',
            medico_ayuda_li1_desc: ' The API securely injects your user ID using the token. You cannot impersonate another doctor\'s schedule.',
            medico_ayuda_li2_title: 'Interval mapping:',
            medico_ayuda_li2_desc: ' If you open from 09:00 to 10:00 with 15-minute intervals, the system will automatically generate 4 independent slots ready for patients to book from the mobile application.',
            medico_ayuda_li3_title: 'Assigned centers:',
            medico_ayuda_li3_desc: ' Only the medical centers formally linked to you by the Administrator from the global panel will appear in your list.'
        }
    };

    constructor() {
        // Recuperar el idioma guardado previamente en el navegador del usuario
        const savedLang = localStorage.getItem('lang');
        if (savedLang) this.currentLang = savedLang;
    }

    setLanguage(lang: string) {
        this.currentLang = lang;
        localStorage.setItem('lang', lang); // Lo guarda para que no se pierda al recargar
    }

    // Método clave para obtener el texto dinámico
    get(key: string): string {
        return this.dictionary[this.currentLang]?.[key] || key;
    }
}