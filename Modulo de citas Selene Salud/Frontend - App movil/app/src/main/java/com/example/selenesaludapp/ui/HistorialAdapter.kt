package com.example.selenesaludapp.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.selenesaludapp.data.InformeItem
import com.example.selenesaludapp.databinding.ItemInformeBinding
import java.util.Locale

class HistorialAdapter : RecyclerView.Adapter<HistorialAdapter.InformeViewHolder>() {

    private var listaOriginal: List<InformeItem> = emptyList()
    private var listaFiltrada: List<InformeItem> = emptyList()

    fun updateList(nuevaLista: List<InformeItem>) {
        this.listaOriginal = nuevaLista
        this.listaFiltrada = nuevaLista
        notifyDataSetChanged()
    }

    // Lógica interna para filtrar diagnósticos o medicamentos
    fun filtrar(texto: String) {
        val busqueda = texto.lowercase(Locale.getDefault()).trim()
        listaFiltrada = if (busqueda.isEmpty()) {
            listaOriginal
        } else {
            listaOriginal.filter { informe ->
                informe.diagnostico.lowercase(Locale.getDefault()).contains(busqueda) ||
                        informe.tratamiento.lowercase(Locale.getDefault()).contains(busqueda)
            }
        }
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): InformeViewHolder {
        val binding = ItemInformeBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return InformeViewHolder(binding)
    }

    override fun onBindViewHolder(holder: InformeViewHolder, position: Int) {
        holder.bind(listaFiltrada[position])
    }

    override fun getItemCount(): Int = listaFiltrada.size

    inner class InformeViewHolder(private val binding: ItemInformeBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(informe: InformeItem) {
            binding.tvFechaInforme.text = "Consulta médica: ${informe.fecha_cita.take(10)}"
            binding.tvMedicoInforme.text = "Emitido por: Dr/a. ${informe.medico_nombre} ${informe.medico_apellidos}"
            binding.tvDiagnostico.text = informe.diagnostico
            binding.tvTratamiento.text = informe.tratamiento

            if (!informe.observaciones.isNullOrEmpty()) {
                binding.tvObservaciones.text = informe.observaciones
                binding.tvObservaciones.visibility = View.VISIBLE
            } else {
                binding.tvObservaciones.text = "Sin observaciones adicionales."
            }
        }
    }
}