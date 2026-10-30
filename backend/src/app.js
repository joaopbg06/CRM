// Aplicação principal do CRM
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Conectar ao banco de dados
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/produtos', require('./routes/produtoRoutes'));
app.use('/api/vendas', require('./routes/vendaRoutes'));

// Servir arquivos estáticos do Angular (build)
const frontendPath = path.join(__dirname, process.env.FRONTEND_PATH || '../../frontend/dist/frontend/browser');
app.use(express.static(frontendPath));

// Redirecionar todas as rotas não-API para o index.html do Angular (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Servindo frontend de: ${frontendPath}`);
});
