package com.example.selenesaludapp.ui

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.selenesaludapp.data.RetrofitClient
import com.example.selenesaludapp.databinding.ActivityMedicosBinding
import kotlinx.coroutines.launch
import android.util.Log

class MedicosActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMedicosBinding
    private lateinit var adapter: MedicosAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //enableEdgeToEdge()
        binding = ActivityMedicosBinding.inflate(layoutInflater)
        setContentView(binding.root)

        ViewCompat.setOnApplyWindowInsetsListener(binding.mainMedicos) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // 1. Recoger datos del centro que envió CentrosActivity (Tus claves originales)
        val centroId = intent.getIntExtra("CENTRO_ID", -1)
        val centroNombre = intent.getStringExtra("CENTRO_NOMBRE") ?: "Centro Médico"

        binding.tvNombreCentroElegido.text = "Médicos disponibles en:\n$centroNombre"

        // 2. Configurar el RecyclerView
        adapter = MedicosAdapter { medico ->
            val intent = android.content.Intent(this, AgendarCitaActivity::class.java).apply {
                putExtra("MEDICO_ID", medico.id)
                putExtra("MEDICO_NOMBRE", "Dr/a. ${medico.nombre} ${medico.apellidos}")
                putExtra("CENTRO_ID", centroId)
            }
            startActivity(intent)
        }
        binding.rvMedicos.layoutManager = LinearLayoutManager(this)
        binding.rvMedicos.adapter = adapter

        // 3. Cargar médicos asociados al centro
        if (centroId != -1) {
            cargarMedicos(centroId)
        } else {
            Toast.makeText(this, "Error al identificar el centro médico", Toast.LENGTH_SHORT).show()
        }
    }

    private fun cargarMedicos(centroId: Int) {
        binding.progressBarMedicos.visibility = View.VISIBLE

        val prefs = getSharedPreferences("SelenePrefs", MODE_PRIVATE)
        val tokenGuardado = prefs.getString("token", "") ?: ""

        Log.e("API_SELENESALUD", "Valor de tokenGuardado: '$tokenGuardado'")

        if (tokenGuardado.isEmpty()) {
            Log.e("API_SELENESALUD", "Alerta: ¡El token está completamente vacío! La clave o el archivo no coinciden.")
        }

        val tokenFormateado = "Bearer $tokenGuardado"

        lifecycleScope.launch {
            try {
                // 2. Pasamos el token y el ID del centro al nuevo endpoint refinado
                val respuesta = RetrofitClient.instancia.obtenerMedicosPorCentro(tokenFormateado, centroId)

                if (respuesta.isSuccessful && respuesta.body() != null) {
                    // Ahora la respuesta es directamente un List<MedicoItem>
                    val medicos = respuesta.body()!!
                    if (medicos.isEmpty()) {
                        Toast.makeText(this@MedicosActivity, "No hay médicos disponibles en este centro", Toast.LENGTH_LONG).show()
                        adapter.updateList(emptyList()) // Limpiamos la lista por si acaso
                    } else {
                        adapter.updateList(medicos)
                    }
                } else {
                    val codigoHttp = respuesta.code()
                    val cuerpoError = respuesta.errorBody()?.string()
                    Log.e("API_SELENESALUD", "Error del servidor -> Código: $codigoHttp | Detalle: $cuerpoError")
                    Toast.makeText(this@MedicosActivity, "Error al cargar el cuadro médico (HTTP: $codigoHttp)", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Log.e("API_SELENESALUD", "Excepción en la red", e)
                Toast.makeText(this@MedicosActivity, "Error de red al conectar con el servidor", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBarMedicos.visibility = View.GONE
            }
        }
    }
}