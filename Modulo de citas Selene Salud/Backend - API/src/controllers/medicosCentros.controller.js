const db = require("../config/db");

/**
 * 1. ASIGNAR UN MÉDICO A UN CENTRO DE SALUD (Muchos a Muchos)
 * POST /api/medicos-centros
 * Protegido: Solo ADMIN
 */
const asignarMedicoACentro = async (req, res) => {
    const { id_medico, id_centro } = req.body;

    if (!id_medico || !id_centro) {
        return res.status(400).json({ error: "id_medico e id_centro son obligatorios" });
    }

    try {
        // Validación de seguridad extra: Verificar si el id_medico pertenece a un usuario con ROL = 'MEDICO'
        const queryUser = "SELECT rol FROM usuarios WHERE id = $1";
        const resUser = await db.query(queryUser, [id_medico]);

        if (resUser.rows.length === 0) {
            return res.status(444).json({ error: "El usuario especificado no existe" });
        }

        if (resUser.rows[0].rol !== "MEDICO") {
            return res.status(400).json({ error: "El usuario seleccionado no tiene el rol de MEDICO y no puede ser asignado a un centro" });
        }

        // Insertar la relación en la tabla intermedia
        const sql = `
            INSERT INTO medicos_centros (id_medico, id_centro)
            VALUES ($1, $2)
            RETURNING id_medico, id_centro;
        `;
        const resultado = await db.query(sql, [id_medico, id_centro]);

        res.status(201).json({
            mensaje: "Médico asignado al centro de salud con éxito",
            relacion: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al asignar médico a centro:", error);

        // Control de duplicados (Evita asignar el mismo médico al mismo centro dos veces)
        if (error.code === "23505") {
            return res.status(409).json({ error: "Este médico ya se encuentra asignado a este centro de salud" });
        }
        
        // Control de errores de clave foránea (por ejemplo si el id_centro no existe)
        if (error.code === "23503") {
            return res.status(404).json({ error: "El centro de salud especificado no existe en el sistema" });
        }

        res.status(500).json({ error: "Error interno del servidor al procesar la asignación" });
    }
};

/**
 * 2. OBTENER LOS CENTROS DONDE TRABAJA UN MÉDICO ESPECÍFICO
 * GET /api/medicos-centros/medico/:id_medico
 * Protegido: ADMIN y el propio MEDICO
 */
const obtenerCentrosDeMedico = async (req, res) => {
    const { id_medico } = req.params;

    try {
        // Consulta haciendo un JOIN para traer la información completa del hospital
        const sql = `
            SELECT c.* FROM medicos_centros mc
            JOIN centros_salud c ON mc.id_centro = c.id
            WHERE mc.id_medico = $1;
        `;
        const resultado = await db.query(sql, [id_medico]);

        res.json({
            id_medico: parseInt(id_medico, 10),
            total_centros: resultado.rows.length,
            centros: resultado.rows
        });

    } catch (error) {
        console.error("Error al obtener centros del médico:", error);
        res.status(500).json({ error: "Error interno del servidor al consultar los centros" });
    }
};

/**
 * 3. DESVINCULAR UN MÉDICO DE UN CENTRO
 * DELETE /api/medicos-centros/medico/:id_medico/centro/:id_centro
 * Protegido: Solo ADMIN
 */
const desvincularMedicoDeCentro = async (req, res) => {
    const { id_medico, id_centro } = req.params;

    try {
        const sql = `
            DELETE FROM medicos_centros 
            WHERE id_medico = $1 AND id_centro = $2
            RETURNING *;
        `;
        const resultado = await db.query(sql, [id_medico, id_centro]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "No existe ninguna vinculación activa entre este médico y este centro" });
        }

        res.json({ mensaje: "Médico desvinculado del centro correctamente" });

    } catch (error) {
        console.error("Error al desvincular médico:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar la vinculación" });
    }
};

module.exports = {
    asignarMedicoACentro,
    obtenerCentrosDeMedico,
    desvincularMedicoDeCentro
};