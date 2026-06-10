const express = require("express");
const router = express.Router();
const medicosCentrosController = require("../controllers/medicosCentros.controller");

// Importamos el guardián de seguridad que creamos en el paso anterior
const { verificarToken, permitirRoles } = require("../middlewares/auth.middleware");

// 1. Asignar médico a centro -> Solo los administradores pueden gestionar contratos
router.post("/", verificarToken, permitirRoles("ADMIN"), medicosCentrosController.asignarMedicoACentro);

// 2. Ver centros de un médico -> Permitido tanto a administradores como a los propios médicos para ver su lugar de trabajo
router.get("/medico/:id_medico", verificarToken, permitirRoles("ADMIN", "MEDICO"), medicosCentrosController.obtenerCentrosDeMedico);

// 3. Desvincular médico de centro -> Solo los administradores
router.delete("/medico/:id_medico/centro/:id_centro", verificarToken, permitirRoles("ADMIN"), medicosCentrosController.desvincularMedicoDeCentro);

// 4. Ver médicos de un centro -> Permitido a ADMIN y PACIENTE para que elijan su facultativo
router.get("/centro/:id_centro", verificarToken, permitirRoles("ADMIN", "PACIENTE"), medicosCentrosController.obtenerMedicosDeCentro);
module.exports = router;