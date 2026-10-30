// Controlador de Clientes
const Cliente = require('../models/Cliente');

// @desc    Listar clientes
// @route   GET /api/clientes
// @access  Private
exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find({ ativo: true }).sort('nome');
    res.json({ sucesso: true, clientes });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Buscar cliente por ID
// @route   GET /api/clientes/:id
// @access  Private
exports.buscarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ sucesso: false, mensagem: 'Cliente não encontrado' });
    }
    res.json({ sucesso: true, cliente });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Criar cliente
// @route   POST /api/clientes
// @access  Private
exports.criarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json({ sucesso: true, cliente });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Atualizar cliente
// @route   PUT /api/clientes/:id
// @access  Private
exports.atualizarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!cliente) {
      return res.status(404).json({ sucesso: false, mensagem: 'Cliente não encontrado' });
    }
    res.json({ sucesso: true, cliente });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Excluir cliente (soft delete)
// @route   DELETE /api/clientes/:id
// @access  Private
exports.excluirCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true });
    if (!cliente) {
      return res.status(404).json({ sucesso: false, mensagem: 'Cliente não encontrado' });
    }
    res.json({ sucesso: true, mensagem: 'Cliente excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};
