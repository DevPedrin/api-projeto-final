------------------------------------------------------------
-- SEED COMPLETO DO SISTEMA (PERMISSÕES ESTÁTICAS)
------------------------------------------------------------

------------------------------------------------------------
-- 1) CARGOS (roles)
------------------------------------------------------------
INSERT INTO roles (name, description) VALUES
('Almoxarife', NULL),
('Auxiliar de Almoxarife', NULL),
('Estoquista', NULL),
('ADM', 'Administrador de sistema'),
('TI', 'Equipe Técnica'),
('Supervisor', NULL),
('RH', 'Recursos Humanos');

------------------------------------------------------------
-- 2) PERMISSÕES (permissions)
------------------------------------------------------------
INSERT INTO permissions (key, description) VALUES
-- usuários
('create_user', 'Criar usuários'),
('edit_user', 'Editar usuários'),
('delete_user', 'Excluir usuários'),
('view_users', 'Visualizar usuários'),
('reset_other_password', 'Resetar senha de outros usuários'),

-- produtos
('create_produto', 'Criar produtos'),
('edit_produto', 'Editar produtos'),
('delete_produto', 'Excluir produtos'),
('view_produto', 'Visualizar produtos'),

-- fornecedores
('create_fornecedor', 'Criar fornecedores'),
('edit_fornecedor', 'Editar fornecedores'),
('view_fornecedor', 'Visualizar fornecedores'),

-- fabricantes
('create_fabricante', 'Criar fabricantes'),
('edit_fabricante', 'Editar fabricantes'),
('view_fabricante', 'Visualizar fabricantes');

------------------------------------------------------------
-- 3) ASSOCIAÇÃO DE PERMISSÕES POR CARGO
------------------------------------------------------------

-- ADM (acesso total)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ADM'
  AND p.key IN (
    -- usuários
    'create_user',
    'edit_user',
    'delete_user',
    'view_users',
    'reset_other_password',

    -- produtos
    'create_produto',
    'edit_produto',
    'delete_produto',
    'view_produto',

    -- fornecedores
    'create_fornecedor',
    'edit_fornecedor',
    'view_fornecedor',

    -- fabricantes
    'create_fabricante',
    'edit_fabricante',
    'view_fabricante'
  );
  

-- Almoxarife
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Almoxarife'
  AND p.key IN (
    'view_produto',
    'edit_produto',
    'view_fornecedor',
    'view_fabricante'
  );

-- Auxiliar de Almoxarife
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Auxiliar de Almoxarife'
  AND p.key IN (
    'view_produto',
    'view_fornecedor'
  );

-- Estoquista
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Estoquista'
  AND p.key IN (
    'view_produto',
    'edit_produto',
    'delete_produto'
  );

-- TI (somente usuários)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'TI'
  AND p.key IN (
    'create_user',
    'edit_user',
    'delete_user',
    'view_users',
    'reset_other_password'
  );

-- Supervisor
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Supervisor'
  AND p.key IN (
    'view_produto',
    'create_produto',
    'edit_produto',
    'delete_produto',
    'view_fornecedor',
    'view_fabricante'
  );

-- RH (somente visualizar usuários)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'RH'
  AND p.key = 'view_users';

------------------------------------------------------------
-- 4) USUÁRIOS PADRÃO
-- senha: Mudar@1234 (bcrypt)
------------------------------------------------------------
INSERT INTO users (
  first_name,
  last_name,
  email,
  password,
  matricula,
  cpf,
  telefone,
  role_id,
  created_at,
  updated_at
) VALUES (
  'Junin',
  'Da TI',
  'ti@sistema.com',
  '$2b$10$R8MSN82YAn3jCGH.9DNcruzQ0yzOgOhSOjQcxzo9RFDzHH51Ajx1G',
  '0001',
  '00000000000',
  '11999999999',
  (SELECT id FROM roles WHERE name = 'TI'),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

INSERT INTO users (
  first_name, last_name, email, password,
  matricula, cpf, telefone,
  role_id, created_at, updated_at, created_by, updated_by
) VALUES
-- Almoxarife
('Carlos', 'Santos', 'almoxarife@sistema.com',
 '$2b$10$R8MSN82YAn3jCGH.9DNcruzQ0yzOgOhSOjQcxzo9RFDzHH51Ajx1G',
 '0002', '11111111111', '11988887777',
 (SELECT id FROM roles WHERE name = 'Almoxarife'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),

-- Auxiliar de Almoxarife
('Maria', 'Oliveira', 'auxalmox@sistema.com',
 '$2b$10$R8MSN82YAn3jCGH.9DNcruzQ0yzOgOhSOjQcxzo9RFDzHH51Ajx1G',
 '0003', '22222222222', '11998886666',
 (SELECT id FROM roles WHERE name = 'Auxiliar de Almoxarife'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),

-- Estoquista
('João', 'Mendes', 'estoquista@sistema.com',
 '$2b$10$R8MSN82YAn3jCGH.9DNcruzQ0yzOgOhSOjQcxzo9RFDzHH51Ajx1G',
 '0004', '33333333333', '11997775555',
 (SELECT id FROM roles WHERE name = 'Estoquista'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),

-- ADM
('Admir', 'Nistrador da Silva', 'adm@sistema.com',
 '$2b$10$R8MSN82YAn3jCGH.9DNcruzQ0yzOgOhSOjQcxzo9RFDzHH51Ajx1G',
 '0005', '44444444444', '11996664444',
 (SELECT id FROM roles WHERE name = 'ADM'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),

-- Supervisor
('Rafael', 'Costa', 'supervisor@sistema.com',
 '$2b$10$R8MSN82YAn3jCGH.9DNcruzQ0yzOgOhSOjQcxzo9RFDzHH51Ajx1G',
 '0006', '55555555555', '11995553333',
 (SELECT id FROM roles WHERE name = 'Supervisor'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),

-- RH
('Camila', 'Souza', 'rh@sistema.com',
 '$2b$10$R8MSN82YAn3jCGH.9DNcruzQ0yzOgOhSOjQcxzo9RFDzHH51Ajx1G',
 '0007', '66666666666', '11994442222',
 (SELECT id FROM roles WHERE name = 'RH'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1);
 
 
 ------------------------------------------------------------
-- 7) PRODUTOS
------------------------------------------------------------
INSERT INTO produtos (
  nome,
  descricao,
  unidade_medida,
  estoque_atual,
  fila,
  prateleira,
  preco,
  ativo,
  fabricante_nome,
  fornecedor_nome,
  created_by,
  created_at,
  updated_at
) VALUES
('Arroz', 'Arroz Tipo 1', 'KG', 150, 'A', '01', 22.50, TRUE, 'Indústria Bom Sabor', 'Distribuidora Silva', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Detergente', 'Detergente Líquido', 'UN', 80, 'B', '02', 2.90, TRUE, 'Higienix S.A.', 'Casa do Estoque', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mouse', 'Mouse USB', 'UN', 40, 'C', '03', 35.00, TRUE, 'TechParts LTDA', 'Super Fornec', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
