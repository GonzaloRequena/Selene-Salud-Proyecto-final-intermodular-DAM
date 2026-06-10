package com.example.selenesaludapp.data

import com.google.gson.annotations.SerializedName

data class CentroItem(
    @SerializedName("id") val id: Int,
    @SerializedName("nombre") val nombre: String,
    @SerializedName("direccion") val direccion: String?,
    @SerializedName("municipio") val municipio: String?,
    @SerializedName("provincia") val provincia: String?,
    @SerializedName("telefono") val telefono: String?,
    @SerializedName("tipo") val tipo: String, // "PUBLICO" o "PRIVADO"
    @SerializedName("clase_centro") val claseCentro: String?
)