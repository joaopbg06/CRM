// Rotas de vendas
const express = require('express');
const router = express.Router();
const { listarVendas, buscarVenda, registrarVenda, aprovarVenda, recusarVenda, concluirVenda, cancelarVenda } = require('../controllers/vendaController');
const { proteger, verificarPermissao, apenasAdm } = require('../middlewares/auth');

router.use(proteger);

router.route('/').get(verificarPermissao('vendas', 'view'), listarVendas).post(verificarPermissao('vendas', 'edit'), registrarVenda);
router.route('/:id').get(verificarPermissao('vendas', 'view'), buscarVenda);
router.put('/:id/aprovar', apenasAdm, aprovarVenda);
router.put('/:id/recusar', apenasAdm, recusarVenda);
router.put('/:id/concluir', apenasAdm, concluirVenda);
router.put('/:id/cancelar', apenasAdm, cancelarVenda);

module.exports = router;
