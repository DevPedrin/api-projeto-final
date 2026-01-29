#  Projeto Final — API Node.js com PostgreSQL

a API  oferece:

- Gerenciamento de usuários
- Autenticação e autorização via JWT
- Controle de permissões baseado em cargos
- Integração com PostgreSQL
- Hash de senhas com bcrypt

---

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- `pg` (client Node)
- JWT (Json Web Token)
- bcrypt
- dotenv

---

##  Requisitos

Para rodar o projeto, você precisa ter instalado:

- Node.js (com npm)
- PostgreSQL


---

##  Instalação

### 1. Clonar o repositório
```sh
git clone <url-do-repo>
cd projeto
```

### 2. Instalar dependências
```sh
npm install
```

---

## ⚙️ Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto contendo as variáveis necessárias para configuração da API e do banco de dados:

```
DATABASE_URL=<string de conexão com o banco>
PORT=<porta onde a API irá rodar>
API_PREFIX=<prefixo base das rotas>
JWT_SECRET=<chave JWT>
```

> Os valores podem ser definidos conforme o ambiente e necessidades do usuário.

## Banco de Dados (PostgreSQL)

Na raiz do projeto existem os arquivos:

- `init.sql` — cria o banco de dados e as tabelas
- `seed.sql` — popula campos necessários (ex: permissões, cargos, usuário inicial)

Para aplicar os scripts:

```sh
psql -U postgres -f init.sql
psql -U postgres -f seed.sql
```

Também pode importar via **pgAdmin**, **DBeaver**, etc.

### Usuário inicial criado pelo seed

- **matricula:** 0001 
- **senha:** `Mudar@1234`  
- **permissões:** criar e gerenciar usuários  

---

## 🚀 Executando a API

Após configurar o banco e o `.env`:

```sh
npm start
```

A API estará acessível

---

## 🔐 Autenticação JWT

A API utiliza **JWT (Bearer Token)**.

### Fluxo de autenticação:

1. Enviar `POST /auth/login` com credenciais
2. API retorna JSON contendo o token JWT
3. Para acessar endpoints protegidos, enviar:

```
Authorization: Bearer <token>
```

Sem token → retorno `401 Unauthorized`.

---

# 📚 Endpoints da API

## **Auth**

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Realiza login |
| POST | `/auth/reset-password` | Resetar senha |
| POST | `/auth/change-password` | Trocar senha |

---

## **Usuários**

| Método | Rota | Descrição |
|---|---|---|
| GET | `/users/me` | Dados do usuário logado |
| GET | `/users/` | Lista usuários  |
| GET | `/users/:id` | Dados por id |
| POST | `/users/` | Cria usuário  |
| PUT | `/users/:id` | Atualiza usuário |
| DELETE | `/users/:id` | Deleta usuário  |

---

## **Produtos**

| Método | Rota | Descrição |
|---|---|---|
| GET | `/products/` | Lista produtos |
| GET | `/products/:id` | Produto por id |
| POST | `/products/` | Cria produto |
| PUT | `/products/:id` | Atualiza produto |
| DELETE | `/products/:id` | Deleta produto |

---