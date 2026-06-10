package com.example.selenesaludapp.ui

import android.content.Context
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.widget.addTextChangedListener
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.selenesaludapp.data.RetrofitClient
import com.example.selenesaludapp.databinding.ActivityHistorialBinding
import kotlinx.coroutines.launch

class HistorialActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHistorialBinding
    private lateinit var adapter: HistorialAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityHistorialBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Configuración de márgenes de pantalla Edge-To-Edge
        ViewCompat.setOnApplyWindowInsetsListener(binding.mainHistorial) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // 1. Configurar RecyclerView
        binding.rvHistorial.layoutManager = LinearLayoutManager(this)
        adapter = HistorialAdapter()
        binding.rvHistorial.adapter = adapter

        // 2. Conectar la barra de búsqueda con el filtro dinámico del adaptador
        binding.etBuscadorHistorial.addTextChangedListener { texto ->
            adapter.filtrar(texto.toString())
        }

        // 3. Descargar el historial clínico del paciente
        cargarHistorialClinico()
    }

    private fun cargarHistorialClinico() {
        val prefs = getSharedPreferences("SelenePrefs", Context.MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("token", "")}"

        // Obtenemos el ID del usuario logueado guardado en las preferencias del login
        val idPaciente = prefs.getInt("paciente_id", -1)

        if (idPaciente == -1) {
            Toast.makeText(this, "Sesión inválida. Vuelve a iniciar sesión.", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        binding.progressBarHistorial.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val respuesta = RetrofitClient.instancia.obtenerHistorialClinico(token, idPaciente)

                if (respuesta.isSuccessful && respuesta.body() != null) {
                    val historial = respuesta.body()!!.historial

                    if (historial.isEmpty()) {
                        binding.tvNoInformes.visibility = View.VISIBLE
                        adapter.updateList(emptyList())
                    } else {
                        binding.tvNoInformes.visibility = View.GONE
                        adapter.updateList(historial)
                    }
                } else {
                    Toast.makeText(this@HistorialActivity, "No se ha podido sincronizar tu expediente", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@HistorialActivity, "Error de red al consultar el historial clínico", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBarHistorial.visibility = View.GONE
            }
        }
    }
}