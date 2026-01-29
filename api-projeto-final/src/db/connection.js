import {Pool} from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
    max: 20,
});


pool.on('error', (err) => {
    console.log('erro inesperado.');
    
    process.exit(-1);
});

export default pool;