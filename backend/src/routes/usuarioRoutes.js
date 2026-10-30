// Rotas de usuários - apenas ADM
const express = require('express');
const router = express.Router();
const { listarUsuarios, criarUsuario, atualizarUsuario, excluirUsuario } = require('../controllers/usuarioController');
const { proteger, apenasAdm } = require('../middlewares/auth');

router.use(proteger);
router.use(apenasAdm);

router.route('/').get(listarUsuarios).post(criarUsuario);
router.route('/:id').put(atualizarUsuario).delete(excluirUsuario);

module.exports = router;
