const express = require("express");
const router = express.Router();
const informesController = require("../controllers/informes.controller");

const { verificarToken, permitirRoles } = require("../middlewares/auth.middleware");

// 1. Redactar informe -> Solo los médicos tienen competencias legales para emitir diagnósticos
router.post("/", verificarToken, permitirRoles("MEDICO"), informesController.crearInforme);

// 2. Ver historial clínico -> Acceso filtrado por seguridad en el controlador
router.get("/paciente/:id_paciente", verificarToken, informesController.obtenerHistorialPaciente);

module.exports = router;