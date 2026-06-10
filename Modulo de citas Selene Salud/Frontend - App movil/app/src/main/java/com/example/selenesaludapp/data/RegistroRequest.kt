package com.example.selenesaludapp.data

data class RegistroRequest(
    val dni_nie: String,
    val nombre: String,
    val apellidos: String,
    val email: String,
    val password: String,
    val telefono: String,
    val rol: String = "PACIENTE" // Forzamos el rol que exige tu base de datos CHECK (rol IN (...))
)

data class RegistroResponse(
    val mensaje: String
)