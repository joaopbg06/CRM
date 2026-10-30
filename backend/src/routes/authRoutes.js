// Rotas de autenticação
const express = require('express');
const router = express.Router();
const { login, me } = require('../controllers/authController');
const { proteger } = require('../middlewares/auth');

router.post('/login', login);
router.get('/me', proteger, me);

module.exports = router;
