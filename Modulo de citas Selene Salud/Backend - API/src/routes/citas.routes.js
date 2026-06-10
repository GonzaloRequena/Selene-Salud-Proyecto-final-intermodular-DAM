const express = require("express");
const router = express.Router();
const citasController = require("../controllers/citas.controller");

const { verificarToken, permitirRoles } = require("../middlewares/auth.middleware");

// 1. Reservar cita -> Solo los Pacientes tienen permitido autogestionar reservas
router.post("/", verificarToken, permitirRoles("PACIENTE"), citasController.crearCita);

// 2. Ver "Mis Citas" -> Protegida pero accesible para Pacientes, Médicos y Admins (El controlador discriminará los datos de salida)
router.get("/mis-citas", verificarToken, citasController.obtenerMisCitas);

// 3. Cancelar cita -> Cualquier usuario autenticado (bajo las reglas de seguridad del controlador)
router.patch("/:id/cancelar", verificarToken, citasController.cancelarCita);

module.exports = router;