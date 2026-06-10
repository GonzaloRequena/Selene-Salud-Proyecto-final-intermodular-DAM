package com.example.selenesaludapp.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.selenesaludapp.data.CentroItem
import com.example.selenesaludapp.data.RetrofitClient
import com.example.selenesaludapp.databinding.ActivityCentrosBinding
import kotlinx.coroutines.launch

class CentrosActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCentrosBinding
    private lateinit var adapter: CentrosAdapter

    // Guardamos la lista completa descargada de Render para poder filtrar sobre ella
    private var listaOriginalCentros: List<CentroItem> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityCentrosBinding.inflate(layoutInflater)
        setContentView(binding.root)

        ViewCompat.setOnApplyWindowInsetsListener(binding.mainCentros) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // 1. Inicializar adaptador con las dos acciones (Clic centro y Clic teléfono)
        adapter = CentrosAdapter(
            onCentroClick = { centroSeleccionado ->
                // Creamos el camino hacia la pantalla de médicos
                val intent = Intent(this, MedicosActivity::class.java).apply {
                    putExtra("CENTRO_ID", centroSeleccionado.id)
                    putExtra("CENTRO_NOMBRE", centroSeleccionado.nombre)
                }
                startActivity(intent)
            },
            onTelefonoClick = { numeroTelefono ->
                // INTENT IMPLÍCITO: Abre la app de marcado del teléfono con el número cargado
                val intentLlamar = Intent(Intent.ACTION_DIAL).apply {
                    data = Uri.parse("tel:$numeroTelefono")
                }
                startActivity(intentLlamar)
            }
        )

        binding.rvCentros.layoutManager = LinearLayoutManager(this)
        binding.rvCentros.adapter = adapter

        // 2. Configurar el Escuchador del Buscador (SearchView)
        binding.searchViewCentros.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false // No necesitamos botón de "Buscar", filtra en tiempo real
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                filtrarCentros(newText)
                return true
            }
        })

        // 3. Cargar datos
        cargarCentrosMedicos()
    }

    private fun cargarCentrosMedicos() {
        binding.progressBarCentros.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val respuesta = RetrofitClient.instancia.obtenerCentros()

                if (respuesta.isSuccessful && respuesta.body() != null) {
                    listaOriginalCentros = respuesta.body()!!
                    adapter.updateList(listaOriginalCentros)
                } else {
                    Toast.makeText(this@CentrosActivity, "Error al obtener los centros", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@CentrosActivity, "Error de red: No se pudo conectar", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBarCentros.visibility = View.GONE
            }
        }
    }

    // Método que filtra localmente la lista según lo que escriba el paciente
    private fun filtrarCentros(texto: String?) {
        if (texto.isNullOrEmpty()) {
            adapter.updateList(listaOriginalCentros) // Si está vacío muestra todo
        } else {
            val listaFiltrada = listaOriginalCentros.filter { centro ->
                val nombreCoincide = centro.nombre.contains(texto, ignoreCase = true)
                val municipioCoincide = centro.municipio?.contains(texto, ignoreCase = true) ?: false

                nombreCoincide || municipioCoincide
            }
            adapter.updateList(listaFiltrada)
        }
    }
}