// Rotas de clientes
const express = require('express');
const router = express.Router();
const { listarClientes, buscarCliente, criarCliente, atualizarCliente, excluirCliente } = require('../controllers/clienteController');
const { proteger, verificarPermissao } = require('../middlewares/auth');

router.use(proteger);

router.route('/').get(verificarPermissao('clientes', 'view'), listarClientes).post(verificarPermissao('clientes', 'edit'), criarCliente);
router.route('/:id').get(verificarPermissao('clientes', 'view'), buscarCliente).put(verificarPermissao('clientes', 'edit'), atualizarCliente).delete(verificarPermissao('clientes', 'edit'), excluirCliente);

module.exports = router;
