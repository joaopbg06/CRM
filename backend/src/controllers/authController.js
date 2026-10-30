// Controlador de autenticação
const Usuario = require('../models/Usuario');
const gerarToken = require('../utils/gerarToken');

// @desc    Login do usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário com senha
    const usuario = await Usuario.findOne({ email }).select('+senha');

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
    }

    const senhaCorreta = await usuario.compararSenha(senha);

    if (!senhaCorreta) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
    }

    res.json({
      sucesso: true,
      token: gerarToken(usuario._id),
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        permissoes: usuario.permissoes
      }
    });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Obter dados do usuário logado
// @route   GET /api/auth/me
// @access  Private
exports.me = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    res.json({
      sucesso: true,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        permissoes: usuario.permissoes
      }
    });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};
