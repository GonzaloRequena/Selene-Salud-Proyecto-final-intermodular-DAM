/***********************************************************************
 * RUTAS PARA EL RECURSO CENTROS DE SALUD
 ***********************************************************************/
const express = require("express");
const router = express.Router();

// Importamos su controlador correspondiente
const centrosController = require("../controllers/centros.controller");

// Definimos que la ruta raíz de este recurso (GET /) llama a obtenerCentros
router.get("/", centrosController.obtenerCentros);

// Exportamos el enrutador
module.exports = router;