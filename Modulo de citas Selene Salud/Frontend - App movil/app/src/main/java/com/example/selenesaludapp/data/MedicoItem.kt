package com.example.selenesaludapp.data

import com.google.gson.annotations.SerializedName

data class MedicoItem(
    @SerializedName("id") val id: Int,
    @SerializedName("nombre") val nombre: String,
    @SerializedName("apellidos") val apellidos: String,
    @SerializedName("email") val email: String?,
    @SerializedName("telefono") val telefono: String?
) {
    // TRUCO DE COMPATIBILIDAD:
    // No viene en el JSON de Neon, pero cualquier parte de tu App que llame a
    // 'medico.especialidad' seguirá funcionando y mostrará este texto por defecto.
    val Blackespecialidad: String
        get() = "Medicina General y Familiar"

    // Si tu adaptador viejo usaba exactamente "medico.especialidad", deja este nombre:
    val especialidad: String
        get() = "Medicina General y Familiar"
}