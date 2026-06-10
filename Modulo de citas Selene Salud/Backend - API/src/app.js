/***********************************************************************
 * CONFIGURACIÓN DE LA APLICACIÓN EXPRESS - SELENE SALUD
 ***********************************************************************/
const express = require('express');
const cors = require('cors');

// Importamos la conexión a la base de datos para el Health Check
const db = require('./config/db');

// Importamos los enrutadores de nuestros recursos
const centrosRoutes = require("./routes/centros.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const medicosCentrosRoutes = require("./routes/medicosCentros.routes");
const disponibilidadRoutes = require("./routes/disponibilidad.routes");
const citasRoutes = require("./routes/citas.routes");
const informesRoutes = require("./routes/informes.routes");

const app = express();

// Middlewares obligatorios según las guías de clase
app.use(cors());
app.use(express.json()); // Permite que la API entienda JSON en las peticiones

// Configuración para servir imágenes estáticas (Práctica 2 de imágenes)
app.use("/img", express.static("public/img"));

/***********************************************************************
 * VINCULACIÓN DE RUTAS (ENDPOINTS)
 ***********************************************************************/
// Enlazamos los recursos con sus rutas correspondientes
app.use("/api/centros", centrosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/medicos-centros", medicosCentrosRoutes);
app.use("/api/disponibilidad", disponibilidadRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/informes", informesRoutes);

// Endpoint de prueba de vida (Health Check) ORIGINAL RESTAURADO
app.get('/api/health', async (req, res) => {
    try {
        // Hacemos una consulta simple para verificar la conexión real con Neon
        const result = await db.query('SELECT NOW()');
        
        res.json({
            status: "OK",
            message: "La API de Selene Salud funciona correctamente y está conectada a Neon.",
            server_time: result.rows[0].now
        });
    } catch (error) {
        console.error("Error en el Health Check:", error);
        res.status(500).json({
            status: "ERROR",
            message: "La API funciona, pero no ha podido conectar con la base de datos de Neon.",
            error: error.message
        });
    }
});

// Exportamos la app tal y como pide la estructura oficial de la asignatura
module.exports = app;