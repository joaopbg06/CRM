// Rotas de produtos
const express = require('express');
const router = express.Router();
const { listarProdutos, buscarProduto, criarProduto, atualizarProduto, excluirProduto } = require('../controllers/produtoController');
const { proteger, verificarPermissao } = require('../middlewares/auth');

router.use(proteger);

router.route('/').get(verificarPermissao('produtos', 'view'), listarProdutos).post(verificarPermissao('produtos', 'edit'), criarProduto);
router.route('/:id').get(verificarPermissao('produtos', 'view'), buscarProduto).put(verificarPermissao('produtos', 'edit'), atualizarProduto).delete(verificarPermissao('produtos', 'edit'), excluirProduto);

module.exports = router;
