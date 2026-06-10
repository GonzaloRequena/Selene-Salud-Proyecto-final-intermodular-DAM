/***********************************************************************
 * SCRIPT SEEDER AVANZADO: VOLCADO DE HOSPITALES CON EXTRA DE MÉTRICAS
 ***********************************************************************/
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const sembrarCentros = async () => {
    console.log("⏳ Iniciando el volcado de datos avanzado desde CNH_2025.json...");

    try {
        // 1. Construir la ruta absoluta hacia tu archivo de hospitales
        const rutaArchivo = path.join(__dirname, "../data/CNH_2025.json");
        
        if (!fs.existsSync(rutaArchivo)) {
            throw new Error(`No se encuentra el archivo de datos en la ruta: ${rutaArchivo}`);
        }
        
        // 2. Leer y parsear el archivo JSON
        const contenido = fs.readFileSync(rutaArchivo, "utf-8");
        const hospitalesExternos = JSON.parse(contenido);

        console.log(`📦 Se han cargado ${hospitalesExternos.length} registros. Procesando inserciones en Neon...`);

        let insertados = 0;
        let omitidos = 0;

        // 3. Recorrer cada hospital del JSON
        for (const hospExt of hospitalesExternos) {
            
            // --- MAPEO DE CAMPOS BASE ---
            const codigo_nacional = hospExt["CCN"] || hospExt["CODCNH"];
            const nombre = hospExt["Nombre Centro"];
            const direccion = hospExt["Dirección"] || "Dirección no disponible";
            const codigo_postal = hospExt["Código Postal"] || null;
            const municipio = hospExt["Municipio"] || null;
            const provincia = hospExt["Provincia"] || null;
            
            // Limpieza del teléfono (nos quedamos con el primero si hay varios)
            let telefono = hospExt["Teléfono"] || null;
            if (telefono && telefono.includes(";")) {
                telefono = telefono.split(";")[0].trim();
            }

            // Clasificación automática de Tipo (PÚBLICO o PRIVADO)
            const dependencia = hospExt["Dependencia Funcional"] || "";
            const tipo = dependencia.toLowerCase().includes("privado") ? 'PRIVADO' : 'PUBLICO'; 

            // --- NUEVO: MAPEO DE CAMPOS ENRIQUECIDOS ---
            // Convertimos las camas a un número entero puro de JavaScript
            const camas = hospExt["CAMAS"] ? parseInt(hospExt["CAMAS"], 10) : 0;
            const clase_centro = hospExt["Clase de Centro"] || null;
            const email = hospExt["Email"] || null;

            // 4. Consulta SQL actualizada con las 3 nuevas columnas y parámetros ($9, $10, $11)
            const sql = `
                INSERT INTO centros_salud 
                (codigo_nacional, nombre, direccion, codigo_postal, municipio, provincia, telefono, tipo, camas, clase_centro, email)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (codigo_nacional) DO NOTHING
                RETURNING id;
            `;

            // Mapeamos el array de valores respetando rigurosamente el orden de las columnas de arriba
            const valores = [
                codigo_nacional, 
                nombre, 
                direccion, 
                codigo_postal, 
                municipio, 
                provincia, 
                telefono, 
                tipo,
                camas,         // $9
                clase_centro,  // $10
                email          // $11
            ];
            
            const resultado = await db.query(sql, valores);

            if (resultado.rows.length > 0) {
                insertados++;
            } else {
                omitidos++;
            }
        }

        console.log(`\n✅ ¡Proceso de volcado enriquecido finalizado con éxito!`);
        console.log(`🔹 Hospitales nuevos insertados en Neon: ${insertados}`);
        console.log(`🔹 Hospitales omitidos por ya existir (Conflicto evitado): ${omitidos}`);

    } catch (error) {
        console.error("❌ Error crítico durante el volcado de datos:", error);
    } finally {
        process.exit();
    }
};

// Ejecutamos la función automáticamente al arrancar el archivo
sembrarCentros();