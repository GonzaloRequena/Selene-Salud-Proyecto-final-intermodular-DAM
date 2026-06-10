package com.example.selenesaludapp.data

import com.google.gson.annotations.SerializedName

/**
 * Representa la respuesta global que envía la API en el inicio de sesión
 */
data class LoginResponse(
    @SerializedName("mensaje") val mensaje: String,
    @SerializedName("token") val token: String,
    @SerializedName("usuario") val usuario: UsuarioItem
)

/**
 * Detalle del objeto del usuario que viene anidado dentro del JSON de login
 */
data class UsuarioItem(
    @SerializedName("id") val id: Int,
    @SerializedName("nombre") val nombre: String,
    @SerializedName("apellidos") val apellidos: String,
    @SerializedName("email") val email: String,
    @SerializedName("rol") val rol: String
)