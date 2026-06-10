package com.example.selenesaludapp.ui

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.selenesaludapp.data.CitaItem
import com.example.selenesaludapp.databinding.ItemCitaBinding

class MisCitasAdapter(
    private val onCancelarClick: (CitaItem) -> Unit
) : RecyclerView.Adapter<MisCitasAdapter.CitaViewHolder>() {

    private var listaCitas: List<CitaItem> = emptyList()

    fun updateList(nuevaLista: List<CitaItem>) {
        this.listaCitas = nuevaLista
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CitaViewHolder {
        val binding = ItemCitaBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return CitaViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CitaViewHolder, position: Int) {
        holder.bind(listaCitas[position])
    }

    override fun getItemCount(): Int = listaCitas.size

    inner class CitaViewHolder(private val binding: ItemCitaBinding) : RecyclerView.ViewHolder(binding.root) {

        fun bind(cita: CitaItem) {
            binding.tvFechaCita.text = cita.fecha_hora.replace(".000Z", "").replace("T", " ")

            // Confeccionamos el nombre completo del profesional con el JOIN de tu backend
            val nombreCompleto = if (!cita.medico_nombre.isNullOrEmpty()) {
                "Dr/a. ${cita.medico_nombre} ${cita.medico_apellidos ?: ""}"
            } else {
                "Médico Asignado"
            }
            binding.tvMedicoCita.text = nombreCompleto
            binding.tvCentroCita.text = cita.centro_nombre ?: "Centro de Salud"

            // Gestión del badge de estado
            val estadoLimpio = cita.estado.uppercase()

            when (estadoLimpio) {
                "PROGRAMADA" -> {
                    binding.tvEstadoBadge.text = "ACTIVA" // O "PROGRAMADA", según prefieras para tu UX
                    binding.tvEstadoBadge.setBackgroundColor(Color.parseColor("#4CAF50")) // Verde
                    binding.btnCancelarCitaCard.visibility = View.VISIBLE // Se puede anular
                }
                "COMPLETADA" -> {
                    binding.tvEstadoBadge.text = "COMPLETADA"
                    binding.tvEstadoBadge.setBackgroundColor(Color.parseColor("#0061A4")) // Azul Selene
                    binding.btnCancelarCitaCard.visibility = View.GONE // No se puede anular una cita ya concluida
                }
                "ANULADA" -> {
                    binding.tvEstadoBadge.text = "ANULADA"
                    binding.tvEstadoBadge.setBackgroundColor(Color.parseColor("#9E9E9E")) // Gris
                    binding.btnCancelarCitaCard.visibility = View.GONE // No se puede anular lo ya anulado
                }
                else -> {
                    // Fallback de seguridad por si acaso
                    binding.tvEstadoBadge.text = estadoLimpio
                    binding.tvEstadoBadge.setBackgroundColor(Color.parseColor("#71787E"))
                    binding.btnCancelarCitaCard.visibility = View.GONE
                }
            }

            binding.btnCancelarCitaCard.setOnClickListener {
                onCancelarClick(cita)
            }
        }
    }
}