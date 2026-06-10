const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");

// Ruta para registrar un nuevo usuario (Paciente, Médico o Admin)
router.post("/registro", usuariosController.registro);

// Ruta para el inicio de sesión
router.post("/login", usuariosController.login);

const { verificarToken, permitirRoles } = require("../middlewares/auth.middleware");

// Ruta para que el Admin obtenga los médicos para sus formularios
router.get("/medicos", verificarToken, permitirRoles("ADMIN", "PACIENTE"), usuariosController.obtenerMedicos);

module.exports = router;