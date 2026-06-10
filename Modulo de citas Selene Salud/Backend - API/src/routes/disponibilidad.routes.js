const express = require("express");
const router = express.Router();
const disponibilidadController = require("../controllers/disponibilidad.controller");

const { verificarToken, permitirRoles } = require("../middlewares/auth.middleware");

// 1. Crear turnos -> Solo los Médicos y los Administradores pueden alterar la agenda de la clínica
router.post("/", verificarToken, permitirRoles("MEDICO", "ADMIN"), disponibilidadController.crearDisponibilidad);

// 2. Ver turnos por centro -> Cualquier usuario registrado (incluidos PACIENTES) puede consultarlos para pedir cita
router.get("/centro/:id_centro", verificarToken, disponibilidadController.obtenerDisponibilidadPorCentro);

// 3. Ver turnos de un médico específico en un centro determinado
router.get("/centro/:id_centro/medico/:id_medico", verificarToken, disponibilidadController.obtenerDisponibilidadMedicoEnCentro);

module.exports = router;