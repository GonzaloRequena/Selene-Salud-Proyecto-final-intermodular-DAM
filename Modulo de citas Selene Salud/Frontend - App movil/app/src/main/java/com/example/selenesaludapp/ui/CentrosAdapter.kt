package com.example.selenesaludapp.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.example.selenesaludapp.data.CentroItem
import com.example.selenesaludapp.databinding.ItemCentroBinding

class CentrosAdapter(
    private val onCentroClick: (CentroItem) -> Unit,
    private val onTelefonoClick: (String) -> Unit // Nueva acción para el teléfono
) : RecyclerView.Adapter<CentrosAdapter.CentrosViewHolder>() {

    private var listaCentros: List<CentroItem> = emptyList()

    fun updateList(nuevaLista: List<CentroItem>) {
        this.listaCentros = nuevaLista
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CentrosViewHolder {
        val binding = ItemCentroBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return CentrosViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CentrosViewHolder, position: Int) {
        holder.bind(listaCentros[position], onCentroClick, onTelefonoClick)
    }

    override fun getItemCount(): Int = listaCentros.size

    class CentrosViewHolder(private val binding: ItemCentroBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(centro: CentroItem, onCentroClick: (CentroItem) -> Unit, onTelefonoClick: (String) -> Unit) {
            binding.tvNombreCentro.text = centro.nombre
            binding.tvClaseCentro.text = centro.claseCentro ?: "Centro médico"
            binding.tvDireccionCentro.text = centro.direccion ?: "Sin dirección"
            binding.tvLocalidadCentro.text = "📍 ${centro.municipio ?: ""}, ${centro.provincia ?: ""}"

            // Configurar el teléfono si existe
            if (!centro.telefono.isNullOrEmpty()) {
                binding.tvTelefonoCentro.visibility = View.VISIBLE
                binding.tvTelefonoCentro.text = "📞 ${centro.telefono}"
                binding.tvTelefonoCentro.setOnClickListener { onTelefonoClick(centro.telefono) }
            } else {
                binding.tvTelefonoCentro.visibility = View.GONE
            }

            // Color del tag público / privado
            if (centro.tipo.uppercase() == "PRIVADO") {
                binding.tvTipoCentro.text = "PRIVADO"
                binding.tvTipoCentro.background.setTint(ContextCompat.getColor(itemView.context, android.R.color.holo_orange_dark))
            } else {
                binding.tvTipoCentro.text = "PÚBLICO"
                binding.tvTipoCentro.background.setTint(ContextCompat.getColor(itemView.context, android.R.color.holo_green_dark))
            }

            // Clic en la tarjeta entera para seleccionar el centro
            itemView.setOnClickListener { onCentroClick(centro) }
        }
    }
}