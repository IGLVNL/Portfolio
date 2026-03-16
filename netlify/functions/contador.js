const { Pool } = require("pg");
    const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    });
    exports.handler = async () => {
    const hoy = new Date();
    const mesActual = hoy.toISOString().slice(0,7);
    const dia = hoy.getDate();
    const result = await pool.query(
        "SELECT visitas, ultima_reset FROM estadisticas WHERE id = 1"
    );
    let visitas = result.rows[0].visitas;
    let ultimoReset = result.rows[0].ultima_reset;
    if(dia === 1 && mesActual > ultimoReset){
        visitas = 10;
        ultimoReset = mesActual + "-01";
    }
    visitas++;
    await pool.query(
        "UPDATE estadisticas SET visitas=$1, ultima_reset=$2 WHERE id=1",
        [visitas, ultimoReset]
    );
    return {
        statusCode: 200,
        body: JSON.stringify({ visitas })
    };
    };