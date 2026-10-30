# CRM para Portfólio

Sistema CRM completo para controle de vendas, desenvolvido com **Angular** (frontend) e **Node.js + Express.js** (backend) com API REST.

## Tecnologias Utilizadas

### Frontend
- Angular 22
- TypeScript
- Tailwind CSS 4
- RxJS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Token) para autenticação
- Bcrypt.js para criptografia de senhas
- CORS

## Funcionalidades

### Autenticação e Controle de Acesso
- **Login com email e senha**
- **Sistema de permissões por tela**: Cada usuário pode ter permissão `nenhum`, `apenas visualização (view)` ou `edição (edit)`
- **Acesso Administrador**: Usuários com tipo `adm` têm acesso total ao sistema
- **Gerenciamento de usuários** (apenas ADM): Criar, editar, configurar permissões e níveis de acesso

### Controle de Clientes
- Cadastro e gerenciamento de clientes
- Ao registrar uma venda, caso seja a primeira vez do cliente, é possível cadastrá-lo diretamente no momento da venda

### Controle de Produtos
- Cadastro e gerenciamento de produtos com preço e estoque
- Vinculação com vendas

### Controle de Vendas
Fluxo completo de vendas:
1. **Registrar venda** - Status: `pendente` (aguardando aprovação do administrador)
2. **Aprovar ou Recusar** - Apenas administradores podem aprovar ou recusar vendas pendentes
3. **Concluir ou Cancelar** - Após aprovada, o administrador pode concluir ou cancelar a venda

**Status das vendas:**
- `pendente` - Aguardando aprovação
- `aprovado` - Aprovada, aguardando conclusão
- `concluido` - Venda finalizada com sucesso
- `recusado` - Venda recusada pelo administrador
- `cancelado` - Venda cancelada

## Arquitetura

### Como funciona (Frontend + Backend integrados)

O **Angular** precisa ser compilado (`ng build`) gerando arquivos estáticos na pasta `dist/`. O **servidor Node.js/Express** serve esses arquivos estáticos através do `express.static()` e redireciona todas as rotas não-API para o `index.html` do Angular, permitindo o funcionamento correto de uma SPA.

**Fluxo:**
1. Frontend Angular é buildado: `ng build --configuration production`
2. Arquivos gerados vão para: `frontend/dist/frontend/browser/`
3. Backend configura `app.use(express.static(frontendPath))` apontando para essa pasta
4. Rotas `/api/*` são tratadas pela API REST
5. Demais rotas são redirecionadas para `index.html` (roteamento Angular)

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 18+)
- MongoDB (local ou MongoDB Atlas)
- Angular CLI instalado globalmente ou via npx

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd projetos
```

### 2. Configurar o Backend
```bash
cd backend
npm install
```

Crie ou edite o arquivo `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/crm_portfolio
JWT_SECRET=sua_chave_secreta_jwt
NODE_ENV=development
FRONTEND_PATH=../frontend/dist/frontend/browser
```

### 3. Buildar o Frontend
```bash
cd ../frontend
npm install
ng build --configuration production
```

### 4. Iniciar o Backend
```bash
cd ../backend
npm run dev  # Desenvolvimento com nodemon
# ou
npm start    # Produção
```

Acesse: `http://localhost:3000`

## Estrutura do Projeto

```
projetos/
├── frontend/           # Aplicação Angular
│   ├── src/
│   │   ├── app/       # Componentes, rotas, serviços
│   │   └── ...
│   └── dist/          # Arquivos buildados (gerados após ng build)
│
└── backend/           # API Node.js + Express
    ├── src/
    │   ├── config/    # Configurações (banco de dados)
    │   ├── controllers/ # Lógica de negócio
    │   ├── middlewares/  # Middlewares (auth, permissões)
    │   ├── models/      # Modelos Mongoose
    │   ├── routes/      # Rotas da API
    │   ├── utils/       # Utilitários
    │   └── app.js       # Arquivo principal
    ├── .env
    └── package.json
```

## API REST Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado

### Usuários (apenas ADM)
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/:id` - Atualizar usuário/permissões
- `DELETE /api/usuarios/:id` - Excluir usuário

### Clientes
- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/:id` - Buscar cliente
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Excluir cliente

### Produtos
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/:id` - Buscar produto
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Excluir produto

### Vendas
- `GET /api/vendas` - Listar vendas
- `GET /api/vendas/:id` - Buscar venda
- `POST /api/vendas` - Registrar venda (cadastra cliente se novo)
- `PUT /api/vendas/:id/aprovar` - Aprovar venda (ADM)
- `PUT /api/vendas/:id/recusar` - Recusar venda (ADM)
- `PUT /api/vendas/:id/concluir` - Concluir venda (ADM)
- `PUT /api/vendas/:id/cancelar` - Cancelar venda (ADM)

## Primeiro Acesso

Para criar o primeiro usuário administrador, você pode usar o MongoDB diretamente ou criar uma rota temporária. Recomendado criar manualmente no banco:

```javascript
// No MongoDB
db.usuarios.insertOne({
  nome: "Administrador",
  email: "admin@crm.com",
  senha: "$2a$10$...", // senha criptografada com bcrypt
  tipo: "adm",
  permissoes: {
    clientes: "edit",
    produtos: "edit",
    vendas: "edit",
    usuarios: "edit",
    configuracoes: "edit"
  },
  ativo: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Ou utilize uma ferramenta como MongoDB Compass para inserir o registro.

## Versionamento Git

Este projeto segue um fluxo com branches:
- `main` - Branch principal (código estável)
- `dev` - Branch de desenvolvimento

Commits são realizados por marcos conforme o desenvolvimento avança.

## Licença

ISC
