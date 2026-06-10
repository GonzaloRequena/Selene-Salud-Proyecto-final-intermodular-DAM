package com.example.selenesaludapp.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.selenesaludapp.data.MedicoItem
import com.example.selenesaludapp.databinding.ItemMedicoBinding

class MedicosAdapter(
    private val onMedicoClick: (MedicoItem) -> Unit
) : RecyclerView.Adapter<MedicosAdapter.MedicosViewHolder>() {

    private var listaMedicos: List<MedicoItem> = emptyList()

    fun updateList(nuevaLista: List<MedicoItem>) {
        this.listaMedicos = nuevaLista
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MedicosViewHolder {
        val binding = ItemMedicoBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return MedicosViewHolder(binding)
    }

    override fun onBindViewHolder(holder: MedicosViewHolder, position: Int) {
        holder.bind(listaMedicos[position], onMedicoClick)
    }

    override fun getItemCount(): Int = listaMedicos.size

    class MedicosViewHolder(private val binding: ItemMedicoBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(medico: MedicoItem, onMedicoClick: (MedicoItem) -> Unit) {
            binding.tvNombreMedico.text = "${medico.nombre} ${medico.apellidos}"
            binding.tvEspecialidadMedico.text = medico.especialidad
            itemView.setOnClickListener { onMedicoClick(medico) }
        }
    }
}