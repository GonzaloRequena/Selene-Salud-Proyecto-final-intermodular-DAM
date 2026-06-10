package com.example.selenesaludapp.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.example.selenesaludapp.data.CitaRequest
import com.example.selenesaludapp.data.DisponibilidadItem
import com.example.selenesaludapp.data.RetrofitClient
import com.example.selenesaludapp.databinding.ActivityAgendarCitaBinding
import kotlinx.coroutines.launch
import java.util.Calendar
import java.util.Locale

class AgendarCitaActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAgendarCitaBinding
    private var fechaSeleccionada: String = ""

    // Identificadores de la cita
    private var medicoId: Int = -1
    private var centroId: Int = -1

    // Lista global para almacenar la agenda que descargamos de Neon
    private var listadoTurnosGlobal: List<DisponibilidadItem> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //enableEdgeToEdge()
        binding = ActivityAgendarCitaBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Ajuste para el modo Edge-To-Edge usando tu ID de layout 'mainAgendarCita'
        ViewCompat.setOnApplyWindowInsetsListener(binding.mainAgendarCita) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // 1. Recoger los datos enviados desde MedicosActivity
        medicoId = intent.getIntExtra("MEDICO_ID", -1)
        val medicoNombre = intent.getStringExtra("MEDICO_NOMBRE") ?: "Médico"
        centroId = intent.getIntExtra("CENTRO_ID", -1)

        binding.tvMedicoSeleccionado.text = "Cita con: $medicoNombre"

        if (medicoId == -1 || centroId == -1) {
            Toast.makeText(this, "Error al sincronizar datos del médico y centro", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        // 2. Inicializar la fecha con el día de hoy formateado (Formato Estándar SQL: YYYY-MM-DD)
        val calendar = Calendar.getInstance()
        fechaSeleccionada = formatearFecha(
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH) + 1,
            calendar.get(Calendar.DAY_OF_MONTH)
        )

        // 3. Descargar la agenda completa del médico para este centro
        obtenerAgendaMedica()

        // 4. Detectar cuando el usuario cambia de fecha en el calendario gráfico
        binding.calendarViewCita.setOnDateChangeListener { _, year, month, dayOfMonth ->
            // Recordar que los meses en CalendarView van de 0 a 11, sumamos 1
            fechaSeleccionada = formatearFecha(year, month + 1, dayOfMonth)

            // Cada vez que cambia el día, filtramos los horarios disponibles correspondientes
            filtrarHorariosPorFecha(fechaSeleccionada)
        }

        // 5. Botón de confirmar acción final (Reserva en Base de Datos)
        binding.btnConfirmarCita.setOnClickListener {
            val itemSeleccionado = binding.spinnerHoras.selectedItem
            if (itemSeleccionado == null || itemSeleccionado.toString().contains("No hay")) {
                Toast.makeText(this, "Por favor, selecciona una hora válida", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val horaSeleccionada = itemSeleccionado.toString()
            mostrarDialogoConfirmacion(horaSeleccionada)
        }
    }

    /**
     * Descarga los turnos futuros del médico desde el backend
     */
    private fun obtenerAgendaMedica() {
        val prefs = getSharedPreferences("SelenePrefs", Context.MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("token", "")}"

        lifecycleScope.launch {
            try {
                val respuesta = RetrofitClient.instancia.obtenerDisponibilidadMedico(token, centroId, medicoId)

                if (respuesta.isSuccessful && respuesta.body() != null) {
                    listadoTurnosGlobal = respuesta.body()!!

                    // Una vez descargados todos los turnos, filtramos los del día actual por defecto
                    filtrarHorariosPorFecha(fechaSeleccionada)
                } else {
                    Toast.makeText(this@AgendarCitaActivity, "No se pudo obtener la disponibilidad del profesional", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Log.e("API_SELENESALUD", "Error al conectar con la agenda", e)
                Toast.makeText(this@AgendarCitaActivity, "Error de red al consultar horarios libres", Toast.LENGTH_SHORT).show()
            }
        }
    }

    /**
     * Filtra en memoria los turnos descargados según la fecha seleccionada y actualiza el Spinner
     */
    private fun filtrarHorariosPorFecha(fecha: String) {
        // Buscamos los turnos cuyo campo 'fecha' coincida exactamente con la seleccionada
        val turnosDelDia = listadoTurnosGlobal.filter { it.fecha == fecha }

        val listadoHorasVisibles = if (turnosDelDia.isEmpty()) {
            listOf("No hay turnos disponibles para esta fecha")
        } else {
            // Mapeamos para quedarnos con los primeros 5 caracteres (ej: "09:30:00" -> "09:30")
            turnosDelDia.map { it.hora_inicio.take(5) }
        }

        // Cargamos los datos reales filtrados en el Spinner
        val adapterHoras = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, listadoHorasVisibles)
        binding.spinnerHoras.adapter = adapterHoras
    }

    /**
     * Muestra una ventana de confirmación antes de guardar de forma irreversible en Neon
     */
    private fun mostrarDialogoConfirmacion(hora: String) {
        AlertDialog.Builder(this)
            .setTitle("Confirmar Reserva")
            .setMessage("¿Deseas confirmar tu cita médica para el día $fechaSeleccionada a las $hora?")
            .setPositiveButton("Confirmar") { _, _ ->
                // Formateamos la combinación exacta que requiere tu citas.controller.js ("YYYY-MM-DD HH:MM:SS")
                val fechaHoraCombinada = "$fechaSeleccionada $hora:00"
                guardarCitaEnServidor(fechaHoraCombinada)
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    /**
     * Ejecuta el POST definitivo hacia /api/citas
     */
    private fun guardarCitaEnServidor(fechaHora: String) {
        val prefs = getSharedPreferences("SelenePrefs", Context.MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("token", "")}"

        val citaRequest = CitaRequest(
            id_medico = medicoId,
            id_centro = centroId,
            fecha_hora = fechaHora
        )

        lifecycleScope.launch {
            try {
                val respuesta = RetrofitClient.instancia.reservarCita(token, citaRequest)

                if (respuesta.isSuccessful && respuesta.body() != null) {
                    val cuerpo = respuesta.body()!!
                    Toast.makeText(this@AgendarCitaActivity, cuerpo.mensaje, Toast.LENGTH_LONG).show()

                    // Redirección limpia al menú principal para refrescar el flujo de pantallas
                    val intent = Intent(this@AgendarCitaActivity, HomeActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
                    }
                    startActivity(intent)
                    finish()
                } else {
                    val errorBody = respuesta.errorBody()?.string()
                    Log.e("API_SELENESALUD", "Error al reservar: $errorBody")
                    Toast.makeText(this@AgendarCitaActivity, "Este horario ya ha sido reservado por otro paciente", Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@AgendarCitaActivity, "Error de red al confirmar la reserva", Toast.LENGTH_SHORT).show()
            }
        }
    }

    /**
     * Helper indispensable para rellenar con ceros a la izquierda (ej: "2026-6-9" -> "2026-06-09")
     * Esto garantiza que coincida perfectamente con las cadenas de texto de Postgres
     */
    private fun formatearFecha(year: Int, month: Int, day: Int): String {
        return String.format(Locale.US, "%04d-%02d-%02d", year, month, day)
    }
}