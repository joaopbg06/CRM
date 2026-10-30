// Controlador de Produtos
const Produto = require('../models/Produto');

// @desc    Listar produtos
// @route   GET /api/produtos
// @access  Private
exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find({ ativo: true }).sort('nome');
    res.json({ sucesso: true, produtos });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Buscar produto por ID
// @route   GET /api/produtos/:id
// @access  Private
exports.buscarProduto = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
    }
    res.json({ sucesso: true, produto });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Criar produto
// @route   POST /api/produtos
// @access  Private
exports.criarProduto = async (req, res) => {
  try {
    const produto = await Produto.create(req.body);
    res.status(201).json({ sucesso: true, produto });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Atualizar produto
// @route   PUT /api/produtos/:id
// @access  Private
exports.atualizarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!produto) {
      return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
    }
    res.json({ sucesso: true, produto });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Excluir produto (soft delete)
// @route   DELETE /api/produtos/:id
// @access  Private
exports.excluirProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true });
    if (!produto) {
      return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
    }
    res.json({ sucesso: true, mensagem: 'Produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};
