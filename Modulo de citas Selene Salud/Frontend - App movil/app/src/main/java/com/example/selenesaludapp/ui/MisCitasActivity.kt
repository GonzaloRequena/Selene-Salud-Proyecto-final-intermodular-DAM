package com.example.selenesaludapp.ui

import android.content.Context
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.selenesaludapp.data.RetrofitClient
import com.example.selenesaludapp.databinding.ActivityMisCitasBinding
import kotlinx.coroutines.launch

class MisCitasActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMisCitasBinding
    private lateinit var adapter: MisCitasAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityMisCitasBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Aplicar insets para Edge-To-Edge
        ViewCompat.setOnApplyWindowInsetsListener(binding.mainMisCitas) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // 1. Configurar RecyclerView
        binding.rvMisCitas.layoutManager = LinearLayoutManager(this)
        adapter = MisCitasAdapter { citaAAnular ->
            // Acción al pulsar en el botón rojo de la tarjeta
            mostrarDialogoAnulacion(citaAAnular)
        }
        binding.rvMisCitas.adapter = adapter

        // 2. Cargar las citas al iniciar la pantalla
        consultarCitasServidor()
    }

    private fun consultarCitasServidor() {
        val prefs = getSharedPreferences("SelenePrefs", Context.MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("token", "")}"

        binding.progressBarCitas.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val respuesta = RetrofitClient.instancia.obtenerMisCitas(token)

                if (respuesta.isSuccessful && respuesta.body() != null) {
                    val citas = respuesta.body()!!.citas

                    if (citas.isEmpty()) {
                        binding.tvNoCitas.visibility = View.VISIBLE
                        adapter.updateList(emptyList())
                    } else {
                        binding.tvNoCitas.visibility = View.GONE
                        adapter.updateList(citas)
                    }
                } else {
                    Toast.makeText(this@MisCitasActivity, "Error al sincronizar tu historial de citas", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@MisCitasActivity, "Error de red al conectar con el servidor", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBarCitas.visibility = View.GONE
            }
        }
    }

    private fun mostrarDialogoAnulacion(cita: com.example.selenesaludapp.data.CitaItem) {
        AlertDialog.Builder(this)
            .setTitle("¿Anular Cita Médica?")
            .setMessage("Esta acción liberará el hueco para otro paciente y no se puede deshacer de forma directa. ¿Proceder?")
            .setPositiveButton("Sí, Anular") { _, _ ->
                procesarCancelacion(cita.id)
            }
            .setNegativeButton("Mantener Cita", null)
            .show()
    }

    private fun procesarCancelacion(idCita: Int) {
        val prefs = getSharedPreferences("SelenePrefs", Context.MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("token", "")}"

        binding.progressBarCitas.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val respuesta = RetrofitClient.instancia.cancelarCita(token, idCita)

                if (respuesta.isSuccessful && respuesta.body() != null) {
                    val cuerpo = respuesta.body()!!
                    Toast.makeText(this@MisCitasActivity, cuerpo.mensaje, Toast.LENGTH_LONG).show()

                    // 🔥 REFRESCAMOS AUTOMÁTICAMENTE LA LISTA DESDE EL SERVIDOR
                    consultarCitasServidor()
                } else {
                    Toast.makeText(this@MisCitasActivity, "No tienes permisos para cancelar esta cita", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@MisCitasActivity, "Error de comunicación con la base de datos", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBarCitas.visibility = View.GONE
            }
        }
    }
}