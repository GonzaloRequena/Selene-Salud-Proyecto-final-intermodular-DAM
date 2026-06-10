package com.example.selenesaludapp.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.example.selenesaludapp.data.RetrofitClient // Revisa la importación
import com.example.selenesaludapp.databinding.ActivityMainBinding
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    // Inicializamos View Binding
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {

        // Instalar la API oficial de Splash Screen
        //installSplashScreen()

        // Retardo controlado para apreciar la animación
        //Thread.sleep(3000)

        super.onCreate(savedInstanceState)
        //enableEdgeToEdge()

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        ViewCompat.setOnApplyWindowInsetsListener(binding.main) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Al hacer clic en el botón de iniciar sesión
        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()

            // Validación básica de campos vacíos
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Por favor, rellena todos los campos", Toast.LENGTH_SHORT).show()
            } else {
                // Ejecutamos la petición a la API
                ejecutarLogin(email, password)
            }
        }

        binding.tvRegistrarse.setOnClickListener {
            // Creamos la intención de viajar desde esta actividad (this) a RegistroActivity
            val intent = Intent(this@MainActivity, RegistroActivity::class.java)
            startActivity(intent)
            // NOTA: Aquí NO hacemos finish() porque si el usuario cancela el registro
            // o pulsa "Atrás" en su móvil, queremos que regrese al Login limpiamente.
        }
    }

    private fun ejecutarLogin(email: String, password: String) {
        // 1. Mostramos la barra de progreso y desactivamos el botón para evitar doble clic
        binding.progressBar.visibility = View.VISIBLE
        binding.btnLogin.isEnabled = false

        // 2. Preparamos el mapa con las credenciales que espera nuestro controlador de Node.js
        val credenciales = mapOf(
            "email" to email,
            "password" to password
        )

        // 3. Lanzamos la corrutina en el ciclo de vida de la Activity para la petición asíncrona
        lifecycleScope.launch {
            try {
                // Llamada a la API mediante Retrofit
                val respuesta = RetrofitClient.instancia.iniciarSesion(credenciales)

                if (respuesta.isSuccessful && respuesta.body() != null) {
                    val loginResponse = respuesta.body()!!

                    // Verificamos si el rol que intenta acceder es un PACIENTE
                    if (loginResponse.usuario.rol == "PACIENTE") {

                        // ¡ÉXITO! Guardamos de forma segura el Token JWT en SharedPreferences
                        val prefs = getSharedPreferences("SelenePrefs", Context.MODE_PRIVATE)
                        prefs.edit().apply {
                            putString("token", loginResponse.token)
                            putInt("paciente_id", loginResponse.usuario.id)
                            putString("nombre", loginResponse.usuario.nombre)
                            apply()
                        }

                        Toast.makeText(this@MainActivity, "¡Bienvenido/a, ${loginResponse.usuario.nombre}!", Toast.LENGTH_LONG).show()

                        val intent = Intent(this@MainActivity, HomeActivity::class.java)
                        startActivity(intent)
                        finish() // Evita que si el paciente da "atrás" en el móvil regrese al formulario de login

                    } else {
                        // Si un médico o admin intenta entrar a la app móvil, le avisamos
                        Toast.makeText(this@MainActivity, "Acceso denegado: Esta app es exclusiva para pacientes", Toast.LENGTH_LONG).show()
                    }
                } else {
                    // La API respondió con un código de error (ej: 400 o 401 Credenciales incorrectas)
                    Toast.makeText(this@MainActivity, "Email o contraseña incorrectos", Toast.LENGTH_SHORT).show()
                }

            } catch (e: Exception) {
                // Error de red (por ejemplo, si el servidor está apagado o no hay internet)
                Toast.makeText(this@MainActivity, "Error de conexión con el servidor", Toast.LENGTH_SHORT).show()
            } finally {
                // 4. Volvemos al estado inicial: ocultamos la carga y reactivamos el botón
                binding.progressBar.visibility = View.GONE
                binding.btnLogin.isEnabled = true
            }
        }
    }
}