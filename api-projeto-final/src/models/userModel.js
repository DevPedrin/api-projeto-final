import pool from '../db/connection.js';
import { AppError } from '../errors/AppError.js';

export async function findByEmail(email) {
  const query = `SELECT * FROM users WHERE email = $1`;

  try {
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar usuário",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function findByRole(role_id) {
  const query = `SELECT * FROM users WHERE role_id = $1`;

  try {
    const { rows } = await pool.query(query, [role_id]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar usuário",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function getAllUsers() {
  const query = `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.matricula,
      u.cpf,
      u.telefone,
      u.active,
      u.password_must_change,
      r.name AS role_name,
      u.created_at,
      u.created_by,
      u.updated_at,
      u.updated_by,
      u.obs
    FROM users AS u
    LEFT JOIN roles AS r ON r.id = u.role_id;
  `;

  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Falha ao carregar usuários",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function findByCpf(cpf) {
  const query = `SELECT * FROM users WHERE cpf = $1`;

  try {
    const { rows } = await pool.query(query, [cpf]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar usuário",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function findByMatricula(matricula) {
  const query = `SELECT * FROM users WHERE matricula = $1`;

  try {
    const { rows } = await pool.query(query, [matricula]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar usuário",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function getUserPermissions(userId) {
  const query = `
    SELECT DISTINCT p.id, p.key, p.description
    FROM permissions p
    JOIN role_permissions rp ON rp.permission_id = p.id
    JOIN roles r ON r.id = rp.role_id
    JOIN users u ON u.role_id = r.id
    WHERE u.id = $1
    ORDER BY p.id;
  `;

  const client = await pool.connect();

  try {
    const { rows } = await client.query(query, [userId]);
    return rows;
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar permissões",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  } finally {
    client.release();
  }
}

export async function getUserById(id) {
  const query = `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.matricula,
      u.cpf,
      u.telefone,
      u.email,
      r.name AS role_name,
      uc.first_name AS created_by_first_name,
      uc.last_name AS created_by_last_name,
      uu.first_name AS updated_by_first_name,
      uu.last_name AS updated_by_last_name,
      u.created_at,
      u.updated_at,
      u.obs
    FROM users u
    JOIN roles r ON r.id = u.role_id
    LEFT JOIN users uc ON uc.id = u.created_by
    LEFT JOIN users uu ON uu.id = u.updated_by
    WHERE u.id = $1;
  `;

  try {
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar usuário",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function getUserRole(user_id) {
  const query = `
    SELECT r.*
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = $1;
  `;

  try {
    const { rows } = await pool.query(query, [user_id]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar cargo",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function getUserInfos(user_id) {
  const query = `
    SELECT id, matricula, cpf, email, first_name, last_name, telefone, role_id, active, created_at, updated_at, password_must_change_at
    FROM users
    WHERE id = $1;
  `;

  try {
    const { rows } = await pool.query(query, [user_id]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar informações do usuário",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function getUserRolePermissions(user_id) {
  const query = `
    SELECT p.*
    FROM users u
    JOIN roles r ON r.id = u.role_id
    JOIN role_permissions rp ON rp.role_id = r.id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE u.id = $1;
  `;

  try {
    const { rows } = await pool.query(query, [user_id]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar permissões do cargo",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function createUser({ first_name, last_name, email, password, matricula, cpf, telefone, role_id }) {
  const client = await pool.connect();

  const query = `
    INSERT INTO users (first_name, last_name, email, password, matricula, cpf, telefone, role_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, matricula;
  `;

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(query, [
      first_name, last_name, email, password, matricula, cpf, telefone, role_id
    ]);

    await client.query("COMMIT");
    return rows[0];
  } catch(error) {
    await client.query("ROLLBACK");
    console.log(`Error -> ${error}`)
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao criar usuário",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  } finally {
    client.release();
  }
}

export async function createNewRole(name, description) {
  const query = `
    INSERT INTO roles (name, description)
    VALUES ($1, $2)
    RETURNING *;
  `;

  try {
    const { rows } = await pool.query(query, [name, description]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao criar cargo",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function createNewPermission(key, description) {
  const query = `
    INSERT INTO permissions (key, description)
    VALUES ($1, $2)
    RETURNING *;
  `;

  try {
    const { rows } = await pool.query(query, [key, description]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao criar permissão",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function updateUserInfos(user_id, {
  first_name, last_name, email, cpf, telefone, active, role_id, obs, updated_by
}) {
  const query = `
    UPDATE users SET
      first_name = COALESCE($2, first_name),
      last_name = COALESCE($3, last_name),
      email = COALESCE($4, email),
      cpf = COALESCE($5, cpf),
      telefone = COALESCE($6, telefone),
      active = COALESCE($7, active),
      role_id = COALESCE($8, role_id),
      obs = COALESCE($9, obs),
      updated_at = NOW(),
      updated_by = $10
    WHERE id = $1
    RETURNING id, first_name, last_name, email, cpf, telefone, active, role_id, obs, updated_at;
  `;

  try {
    const { rows } = await pool.query(query, [
      user_id, first_name ?? null, last_name ?? null, email ?? null,
      cpf ?? null, telefone ?? null, active ?? null, role_id ?? null,
      obs ?? null, updated_by
    ]);

    return rows[0];
  } catch(error) {
    console.log(`Error -> ${error}`)
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao atualizar informações do usuário",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function updateUserPermissions(user_id, permission_id) {
  const query = `
    DELETE FROM user_permissions WHERE user_id = $1;
    INSERT INTO user_permissions (user_id, permission_id)
    SELECT $1, UNNEST($2::int[])
    RETURNING *;
  `;

  try {
    const { rows } = await pool.query(query, [user_id, permission_id]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao atualizar permissões do usuário",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function updateUserRole(role_id, user_id) {
  const query = `
    UPDATE users
    SET role_id = $2, updated_at = NOW()
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const { rows } = await pool.query(query, [role_id, user_id]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao atualizar cargo",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function changePassword(matricula, password) {
  const client = await pool.connect();

  const query = `
    UPDATE users
    SET password = $1,
        password_must_change = FALSE,
        updated_at = CURRENT_TIMESTAMP
    WHERE matricula = $2
    RETURNING id;
  `;

  try {
    await client.query("BEGIN");
    const { rows } = await client.query(query, [password, matricula]);
    await client.query("COMMIT");
    return rows[0];
  } catch(error) {
    await client.query("ROLLBACK");
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao alterar senha",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  } finally {
    client.release();
  }
}

export async function resetPassword(matricula, password, currentUser) {
  const client = await pool.connect();

  const query = `
    UPDATE users
    SET password = $1,
        password_must_change = TRUE,
        updated_at = CURRENT_TIMESTAMP,
        updated_by = $3
    WHERE matricula = $2
    RETURNING id;
  `;

  try {
    await client.query("BEGIN");
    const { rows } = await client.query(query, [password, matricula, currentUser]);
    await client.query("COMMIT");
    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao resetar senha",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  } finally {
    client.release();
  }
}

export async function deleteUser(user_id) {
  const query = `DELETE FROM users WHERE id = $1;`;

  try {
    const { rows } = await pool.query(query, [user_id]);
    return rows[0];
  } catch (error) {
    throw error; // mantém pgError bruto
  }
}

export async function deleteRole(role_id) {
  const query = `DELETE FROM roles WHERE id = $1;`;

  try {
    const { rows } = await pool.query(query, [role_id]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao deletar cargo",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function deletePermission(permission_id) {
  const query = `DELETE FROM permissions WHERE id = $1;`;

  try {
    const { rows } = await pool.query(query, [permission_id]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao deletar permissão",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}

export async function deleteUserPermission(user_id, permission_id) {
  const query = `
    DELETE FROM user_permissions
    WHERE user_id = $1 AND permission_id = $2;
  `;

  try {
    const { rows } = await pool.query(query, [user_id, permission_id]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao remover permissão do usuário",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}