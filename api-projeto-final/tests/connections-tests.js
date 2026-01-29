import dotenv from 'dotenv/config';
import bcrypt from 'bcrypt';
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20
});

pool.on('error', (err) => {
    console.log('erro inesperado.');
    process.exit(-1);
});

async function createUser({ matricula, cpf, email, name, password, role_id, extra_permissions = [] }) {
    const client = await pool.connect();  // <<< necessário para transação

    const insertUserQuery = `
      INSERT INTO users (matricula, email, name, password, role_id, cpf)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const insertRolePermissionsQuery = `
      INSERT INTO user_permissions (user_id, permission_id)
      SELECT $1, permission_id
      FROM role_permissions
      WHERE role_id = $2
    `;

    const insertExtraPermissionsQuery = `
        INSERT INTO user_permissions (user_id, permission_id)
        SELECT $1, p.id
        FROM permissions p
        WHERE p.id = ANY($2)
        ON CONFLICT DO NOTHING
    `;

    try {
        await client.query("BEGIN");

        const hashed = await bcrypt.hash(password, 10);

        const { rows } = await client.query(insertUserQuery, [
            matricula,
            email,
            name,
            hashed,
            role_id,
            cpf
        ]);

        const userId = rows[0].id;

        // Permissões do cargo
        await client.query(insertRolePermissionsQuery, [userId, role_id]);

        // Permissões extras
        if(extra_permissions.length > 0) {
            await client.query(insertExtraPermissionsQuery, [userId, extra_permissions]);
        }

        await client.query("COMMIT");

        console.log(`Usuário criado com sucesso: ID ${userId}`);
        return rows[0];

    } catch(error) {
        await client.query("ROLLBACK");
        console.log(`Erro ao criar usuário: ${error}`);
        throw error;
    } finally {
        client.release();
    }
}

async function test() {
    const query = `SELECT * FROM users WHERE id = $1`;

    const {rows} = await pool.query(query, [1]);

    console.log(rows)
}

await test();
