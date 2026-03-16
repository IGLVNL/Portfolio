const { Pool } = require("pg");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    });
    exports.handler = async (event) => {
    const hoy = new Date();
    const mesActual = hoy.toISOString().slice(0,7);
    const dia = hoy.getDate();
    const ip = event.headers["x-nf-client-connection-ip"] || event.headers["x-forwarded-for"];
    const miIP = "192.168.1.1";
    const result = await pool.query(
        "SELECT visitas, ultima_reset FROM estadisticas WHERE id = 1"
    );
    let visitas = result.rows[0].visitas;
    let ultimoReset = result.rows[0].ultima_reset;
    if (dia === 1 && mesActual > ultimoReset) {
        visitas = 10;
        ultimoReset = mesActual + "-01";
    }
    if (ip !== miIP) {
        visitas++;
        await pool.query(
        "UPDATE estadisticas SET visitas=$1, ultima_reset=$2 WHERE id=1",
        [visitas, ultimoReset]
        );
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ visitas })
    };
};
