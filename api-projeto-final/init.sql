-- ===========================
--  TABELA: roles
-- ===========================
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

-- ===========================
--  TABELA: permissions
-- ===========================
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

-- ===========================
--  TABELA: users
-- ===========================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  matricula VARCHAR(20) UNIQUE NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  telefone VARCHAR(20),

  active BOOLEAN DEFAULT TRUE,
  password_must_change BOOLEAN DEFAULT TRUE,
  role_id INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INT,
  obs TEXT,

  CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT fk_user_created_by FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT fk_user_updated_by FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- ===========================
--  TABELA: role_permissions
-- ===========================
CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,

  PRIMARY KEY (role_id, permission_id),

  CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- ===========================
--  TABELA: fabricantes
-- ===========================
CREATE TABLE fabricantes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  endereco VARCHAR(255),
  bairro VARCHAR(100),
  cnpj VARCHAR(20) UNIQUE,
  telefone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  CONSTRAINT fk_fab_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ===========================
--  TABELA: fornecedores
-- ===========================
CREATE TABLE fornecedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cnpj VARCHAR(20) UNIQUE,
  telefone VARCHAR(20),
  endereco VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  CONSTRAINT fk_forn_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ===========================
--  TABELA: produtos
-- ===========================
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  unidade_medida VARCHAR(10) NOT NULL,
  estoque_atual NUMERIC(10,3) DEFAULT 0 CHECK (estoque_atual >= 0),
  fila VARCHAR(20),
  prateleira VARCHAR(20),
  preco NUMERIC(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,

  fabricante_nome VARCHAR(150) NOT NULL,
  fornecedor_nome VARCHAR(150),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INT,

  CONSTRAINT fk_prod_created_by FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT fk_prod_updated_by FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE movimentos_estoque (
  id SERIAL PRIMARY KEY,
  produto_id INT NOT NULL,
  user_id INT NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  quantidade NUMERIC(10,3) NOT NULL CHECK (quantidade > 0),
  observacao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_mov_prod FOREIGN KEY (produto_id) REFERENCES produtos(id),
  CONSTRAINT fk_mov_user FOREIGN KEY (user_id) REFERENCES users(id)
);
