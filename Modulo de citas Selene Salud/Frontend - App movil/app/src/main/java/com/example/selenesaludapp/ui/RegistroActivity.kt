package com.example.selenesaludapp.ui

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.selenesaludapp.data.RegistroRequest
import com.example.selenesaludapp.data.RetrofitClient
import com.example.selenesaludapp.databinding.ActivityRegistroBinding
import kotlinx.coroutines.launch

class RegistroActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegistroBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //enableEdgeToEdge()
        binding = ActivityRegistroBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Escuchamos cuando el usuario pulsa el botón de registrarse
        binding.btnConfirmarRegistro.setOnClickListener {
            procesarRegistroDeUsuario()
        }
    }

    private fun procesarRegistroDeUsuario() {
        // 1. Extraemos los textos de la interfaz eliminando espacios en blanco innecesarios
        val dni = binding.etRegistroDni.text.toString().trim()
        val nombre = binding.etRegistroNombre.text.toString().trim()
        val apellidos = binding.etRegistroApellidos.text.toString().trim()
        val email = binding.etRegistroEmail.text.toString().trim()
        val password = binding.etRegistroPassword.text.toString().trim()
        val telefono = binding.etRegistroTelefono.text.toString().trim()

        // 2. Validación primaria en el teléfono móvil antes de gastar datos de internet
        if (dni.isEmpty() || nombre.isEmpty() || apellidos.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Por favor, rellene todos los campos obligatorios", Toast.LENGTH_SHORT).show()
            return
        }

        // 3. Construimos el objeto Request adaptado exactamente a lo que pide usuarios.controller.js
        val cuerpoPeticion = RegistroRequest(
            dni_nie = dni,
            nombre = nombre,
            apellidos = apellidos,
            email = email,
            password = password,
            telefono = telefono
        )

        // 4. Mostramos el spinner de carga y congelamos el botón para evitar clics dobles molestos
        binding.progressBarRegistro.visibility = View.VISIBLE
        binding.btnConfirmarRegistro.isEnabled = false

        // 5. Entramos en un hilo asíncrono (Corrutina) para realizar la llamada de red de forma segura
        lifecycleScope.launch {
            try {
                val respuesta = RetrofitClient.instancia.registrarPaciente(cuerpoPeticion)

                if (respuesta.isSuccessful && respuesta.body() != null) {
                    // Estado HTTP 201: El usuario se guardó con éxito en Neon
                    Toast.makeText(this@RegistroActivity, "¡Registro correcto! Inicie sesión ahora.", Toast.LENGTH_LONG).show()
                    finish() // Cierra la pantalla de registro y regresa automáticamente al Login (MainActivity)
                } else {
                    // Analizamos el código de error devuelto por tu Backend
                    val codigoHttp = respuesta.code()
                    if (codigoHttp == 409) {
                        // El código 409 que configuraste para el error 23505 de Postgres
                        Toast.makeText(this@RegistroActivity, "Error: El DNI o el Email ya están registrados en el sistema.", Toast.LENGTH_LONG).show()
                    } else {
                        Toast.makeText(this@RegistroActivity, "Error en el registro. Verifique los datos.", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                // Caída de internet, servidor apagado o URL incorrecta
                Toast.makeText(this@RegistroActivity, "No se pudo conectar con el servidor de Selene Salud", Toast.LENGTH_SHORT).show()
            } finally {
                // Restablecemos los componentes visuales pase lo que pase
                binding.progressBarRegistro.visibility = View.GONE
                binding.btnConfirmarRegistro.isEnabled = true
            }
        }
    }
}