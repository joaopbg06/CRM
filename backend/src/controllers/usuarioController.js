// Controlador de Usuários - Gerenciamento e permissões (apenas ADM)
const Usuario = require('../models/Usuario');

// @desc    Listar todos os usuários
// @route   GET /api/usuarios
// @access  Private/ADM
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-senha').sort('-createdAt');
    res.json({ sucesso: true, usuarios });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Criar novo usuário
// @route   POST /api/usuarios
// @access  Private/ADM
exports.criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, tipo, permissoes } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ sucesso: false, mensagem: 'Email já cadastrado' });
    }

    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      tipo: tipo || 'usuario',
      permissoes: permissoes || {
        clientes: 'view',
        produtos: 'view',
        vendas: 'view',
        usuarios: 'nenhum',
        configuracoes: 'nenhum'
      }
    });

    const usuarioSemSenha = await Usuario.findById(usuario._id).select('-senha');
    res.status(201).json({ sucesso: true, usuario: usuarioSemSenha });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Atualizar usuário (permissões, tipo, etc)
// @route   PUT /api/usuarios/:id
// @access  Private/ADM
exports.atualizarUsuario = async (req, res) => {
  try {
    const { nome, email, tipo, permissoes, ativo } = req.body;

    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (tipo) usuario.tipo = tipo;
    if (permissoes) usuario.permissoes = permissoes;
    if (ativo !== undefined) usuario.ativo = ativo;

    await usuario.save();
    const usuarioSemSenha = await Usuario.findById(usuario._id).select('-senha');
    res.json({ sucesso: true, usuario: usuarioSemSenha });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Excluir usuário
// @route   DELETE /api/usuarios/:id
// @access  Private/ADM
exports.excluirUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }
    await usuario.deleteOne();
    res.json({ sucesso: true, mensagem: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};
