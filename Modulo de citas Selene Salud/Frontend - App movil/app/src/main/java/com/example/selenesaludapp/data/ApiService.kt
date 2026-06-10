package com.example.selenesaludapp.data

import com.google.gson.annotations.SerializedName
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    /**
     * Envía las credenciales de inicio de sesión a la API.
     * Al ser una función 'suspend', se ejecutará de forma asíncrona mediante corrutinas.
     */
    @POST("usuarios/login")
    suspend fun iniciarSesion(
        @Body credenciales: Map<String, String>
    ): Response<LoginResponse>

    // Obtiene la lista de centros de salud desde la API.
    @GET("centros")
    suspend fun obtenerCentros(): Response<List<CentroItem>>

    // Mapea con /api/medicos-centros/centro/:id_centro de tu Node.js
    @GET("medicos-centros/centro/{id_centro}")
    suspend fun obtenerMedicosPorCentro(
        @Header("Authorization") token: String,
        @Path("id_centro") idCentro: Int
    ): Response<List<MedicoItem>>

    // Registra un nuevo paciente enviando los datos necesarios en el cuerpo de la solicitud.
    @POST("usuarios/registro")
    suspend fun registrarPaciente(
        @Body request: RegistroRequest
    ): Response<RegistroResponse>

    // Obtener los huecos de un médico
    @GET("disponibilidad/centro/{id_centro}/medico/{id_medico}")
    suspend fun obtenerDisponibilidadMedico(
        @Header("Authorization") token: String,
        @Path("id_centro") idCentro: Int,
        @Path("id_medico") idMedico: Int
    ): Response<List<DisponibilidadItem>>

    // Confirmar y guardar la cita (POST /api/citas)
    @POST("citas")
    suspend fun reservarCita(
        @Header("Authorization") token: String,
        @Body request: CitaRequest
    ): Response<CitaResponse>

    // Obtener el listado de "Mis Citas" del paciente autenticado
    @GET("citas/mis-citas")
    suspend fun obtenerMisCitas(
        @Header("Authorization") token: String
    ): Response<MisCitasResponse>

    // Cancelar/Anular una cita concreta por su ID (PATCH /api/citas/:id/cancelar)
    @PATCH("citas/{id}/cancelar")
    suspend fun cancelarCita(
        @Header("Authorization") token: String,
        @Path("id") idCita: Int
    ): Response<CitaResponse> // Reutilizamos el CitaResponse de la fase anterior

    // Obtener el historial clínico completo del paciente autenticado (GET /api/informes/paciente/:id_paciente)
    @GET("informes/paciente/{id_paciente}")
    suspend fun obtenerHistorialClinico(
        @Header("Authorization") token: String,
        @Path("id_paciente") idPaciente: Int
    ): Response<HistorialResponse>
}

data class MedicosResponse(
    val total: Int,
    val medicos: List<MedicoItem> // Aquí "medicos" mapea con la propiedad del JSON de Node.js
)

// --- Modelos para la Disponibilidad ---
data class DisponibilidadItem(
    val id: Int,
    val id_medico: Int,
    val id_centro: Int,
    val fecha: String,        // Ej: "2026-06-15"
    val hora_inicio: String,  // Ej: "09:30:00"
    val hora_fin: String,
    val duracion_minutos: Int
)

// --- Modelos para la Creación de Citas ---
data class CitaRequest(
    val id_medico: Int,
    val id_centro: Int,
    val fecha_hora: String    // Formato combinado: "2026-06-15 09:30:00"
)

data class CitaResponse(
    val mensaje: String,
    val cita: CitaDetalle
)

data class CitaDetalle(
    val id: Int,
    val id_paciente: Int,
    val id_medico: Int,
    val id_centro: Int,
    val fecha_hora: String,
    val estado: String
)

// --- Modelo para visualizar las citas en el listado ---
data class CitaItem(
    @SerializedName("cita_id") val id: Int, // Sincroniza 'cita_id' del SQL con 'id' en Kotlin
    val id_paciente: Int,
    val fecha_hora: String,
    val estado: String,
    val estado_pago: String,
    val medico_nombre: String?,
    val medico_apellidos: String?, // Añadido para capturar el apellido del JOIN
    val centro_nombre: String?,
    val centro_municipio: String?
)

// Objeto contenedor que refleja fielmente el JSON de tu citas.controller.js
data class MisCitasResponse(
    val rol_solicitante: String,
    val total: Int,
    val citas: List<CitaItem>
)

// Contenedor principal del JSON del servidor
data class HistorialResponse(
    val id_paciente: Int,
    val total_informes: Int,
    val historial: List<InformeItem>
)

// Modelo de cada informe clínico individual
data class InformeItem(
    @SerializedName("informe_id") val informeId: Int,
    val diagnostico: String,
    val tratamiento: String,
    val observaciones: String?, // Puede ser nulo en tu base de datos
    val fecha_registro: String,
    val medico_nombre: String,
    val medico_apellidos: String,
    val fecha_cita: String
)