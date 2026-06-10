package com.example.selenesaludapp.data

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {

    // URL BASE: la URL exacta del backend desplegado en Render terminado en /api/
    private const val BASE_URL = "https://api-selene-salud.onrender.com/api/"

    val instancia: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create()) // Convierte automáticamente JSON a objetos Kotlin
            .build()
            .create(ApiService::class.java)
    }
}