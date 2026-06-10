package com.example.selenesaludapp.ui // Revisa que sea tu paquete real

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.selenesaludapp.ui.MainActivity
import com.example.selenesaludapp.databinding.ActivityHomeBinding

class HomeActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHomeBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //enableEdgeToEdge()

        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Respetamos los márgenes del sistema gracias a View Binding (mainHome)
        ViewCompat.setOnApplyWindowInsetsListener(binding.mainHome) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // 1. Recuperamos los datos de SharedPreferences para saludar al Paciente
        val prefs = getSharedPreferences("SelenePrefs", Context.MODE_PRIVATE)
        val nombrePaciente = prefs.getString("nombre", "Paciente")
        binding.tvBienvenida.text = "Hola, ¡Bienvenido/a $nombrePaciente!"

        // 2. Configuración de los listeners de los botones
        binding.btnReservarCita.setOnClickListener {
            val intent = Intent(this, CentrosActivity::class.java)
            startActivity(intent)
        }

        binding.btnMisCitas.setOnClickListener {
            val intent = Intent(this, MisCitasActivity::class.java)
            startActivity(intent)
        }

        binding.btnHistorialMedico.setOnClickListener {
            val intent = Intent(this, HistorialActivity::class.java)
            startActivity(intent)
        }

        // 3. Lógica de Cerrar Sesión
        binding.btnCerrarSesion.setOnClickListener {
            // Vaciamos las SharedPreferences de Selene Salud de forma limpia
            prefs.edit().clear().apply()

            Toast.makeText(this, "Sesión cerrada correctamente", Toast.LENGTH_SHORT).show()

            // Redirigimos de vuelta a la pantalla de Login
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish() // Destruimos HomeActivity para que no pueda volver atrás al pulsar el botón físico del móvil
        }
    }
}