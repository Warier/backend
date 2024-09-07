# Sistema de Gerenciamento de Pedidos e Materiais para Impressão 3D

Este projeto é uma API REST para um sistema de gerenciamento de pedidos e materiais para uma empresa de impressão 3D. Ele permite o cadastro de usuários, criação e gerenciamento de pedidos, e controle de estoque de materiais.

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT para autenticação
- dotenv para variáveis de ambiente

## Instalação

1. Clone o repositório
2. Execute `npm install` para instalar as dependências
3. Configure as variáveis de ambiente no arquivo `.env`
4. Execute `npm start` para iniciar o servidor

## Rotas Principais

### Autenticação

- `POST /register`: Registra um novo usuário
- `POST /login`: Autentica um usuário e retorna um token JWT

### Usuários

- `GET /users`: Lista todos os usuários (apenas admin)
- `PUT /users/:id`: Atualiza um usuário
- `DELETE /users/:id`: Deleta um usuário (apenas admin)
- `POST /users/admin`: Cria um novo usuário admin (apenas admin)
- `PUT /users/:id/admin`: Promove um usuário a admin (apenas admin)

### Pedidos

- `GET /orders`: Lista todos os pedidos
- `POST /orders`: Cria um novo pedido
- `GET /orders/:id`: Obtém detalhes de um pedido específico
- `PUT /orders/:id`: Atualiza um pedido
- `DELETE /orders/:id`: Deleta um pedido

### Materiais

- `GET /materials`: Lista todos os materiais
- `POST /materials`: Adiciona um novo material (apenas admin)
- `PUT /materials/:id`: Atualiza um material (apenas admin)
- `DELETE /materials/:id`: Remove um material (apenas admin)
- `GET /usedMaterials`: Lista materiais usados pelo usuário

### Configuração

- `GET /install`: Inicializa o banco de dados com dados de exemplo
- `GET /docs`: Documentação da API (não implementado)

## Exemplos de Uso

### Registro de Usuário
POST /register
Content-Type: application/json
{
"username": "novousuario",
"email": "novo@email.com",
"password": "senha123"
}

### Login
POST /login
Content-Type: application/json
{
"username": "novousuario",
"password": "senha123"
}

### Listar Materiais
GET /materials
Authorization: Bearer <seu_token_jwt>

## Notas

- Certifique-se de incluir o token JWT no cabeçalho `Authorization` para rotas protegidas.
- Algumas rotas são restritas apenas para usuários admin.
- Use a rota `/install` para inicializar o banco de dados com dados de exemplo antes de começar a usar o sistema.

