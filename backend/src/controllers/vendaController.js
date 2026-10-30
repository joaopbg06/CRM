// Controlador de Vendas - Fluxo: registrar (pendente) -> aprovar/recusar (ADM) -> concluir/cancelar
const Venda = require('../models/Venda');
const Cliente = require('../models/Cliente');

// @desc    Listar vendas
// @route   GET /api/vendas
// @access  Private
exports.listarVendas = async (req, res) => {
  try {
    const vendas = await Venda.find()
      .populate('cliente', 'nome email telefone')
      .populate('itens.produto', 'nome preco')
      .populate('registradoPor', 'nome')
      .populate('aprovadoPor', 'nome')
      .sort('-createdAt');
    res.json({ sucesso: true, vendas });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Buscar venda por ID
// @route   GET /api/vendas/:id
// @access  Private
exports.buscarVenda = async (req, res) => {
  try {
    const venda = await Venda.findById(req.params.id)
      .populate('cliente')
      .populate('itens.produto')
      .populate('registradoPor', 'nome')
      .populate('aprovadoPor', 'nome');
    if (!venda) {
      return res.status(404).json({ sucesso: false, mensagem: 'Venda não encontrada' });
    }
    res.json({ sucesso: true, venda });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Registrar nova venda (pode cadastrar cliente se não existir)
// @route   POST /api/vendas
// @access  Private
exports.registrarVenda = async (req, res) => {
  try {
    const { clienteId, clienteNovo, itens, observacao } = req.body;

    let cliente;

    // Se for novo cliente, cadastra
    if (clienteNovo && clienteNovo.nome) {
      cliente = await Cliente.create(clienteNovo);
    } else if (clienteId) {
      cliente = await Cliente.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ sucesso: false, mensagem: 'Cliente não encontrado' });
      }
    } else {
      return res.status(400).json({ sucesso: false, mensagem: 'Cliente é obrigatório' });
    }

    // Calcular valor total
    let valorTotal = 0;
    const itensProcessados = itens.map(item => {
      const subtotal = item.quantidade * item.precoUnitario;
      valorTotal += subtotal;
      return {
        produto: item.produto,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal
      };
    });

    const venda = await Venda.create({
      cliente: cliente._id,
      itens: itensProcessados,
      valorTotal,
      observacao,
      registradoPor: req.usuario.id,
      status: 'pendente'
    });

    const vendaPopulada = await Venda.findById(venda._id)
      .populate('cliente')
      .populate('itens.produto');

    res.status(201).json({ sucesso: true, venda: vendaPopulada, mensagem: 'Venda registrada com sucesso. Aguardando aprovação do administrador.' });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Aprovar venda
// @route   PUT /api/vendas/:id/aprovar
// @access  Private/ADM
exports.aprovarVenda = async (req, res) => {
  try {
    const venda = await Venda.findById(req.params.id);
    if (!venda) {
      return res.status(404).json({ sucesso: false, mensagem: 'Venda não encontrada' });
    }
    if (venda.status !== 'pendente') {
      return res.status(400).json({ sucesso: false, mensagem: 'Apenas vendas pendentes podem ser aprovadas' });
    }

    venda.status = 'aprovado';
    venda.aprovadoPor = req.usuario.id;
    venda.dataAprovacao = new Date();
    await venda.save();

    const vendaPopulada = await Venda.findById(venda._id)
      .populate('cliente')
      .populate('aprovadoPor', 'nome');

    res.json({ sucesso: true, venda: vendaPopulada, mensagem: 'Venda aprovada com sucesso' });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Recusar venda
// @route   PUT /api/vendas/:id/recusar
// @access  Private/ADM
exports.recusarVenda = async (req, res) => {
  try {
    const venda = await Venda.findById(req.params.id);
    if (!venda) {
      return res.status(404).json({ sucesso: false, mensagem: 'Venda não encontrada' });
    }
    if (venda.status !== 'pendente') {
      return res.status(400).json({ sucesso: false, mensagem: 'Apenas vendas pendentes podem ser recusadas' });
    }

    venda.status = 'recusado';
    venda.aprovadoPor = req.usuario.id;
    venda.dataAprovacao = new Date();
    if (req.body.observacao) venda.observacao = req.body.observacao;
    await venda.save();

    res.json({ sucesso: true, venda, mensagem: 'Venda recusada' });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Concluir venda
// @route   PUT /api/vendas/:id/concluir
// @access  Private/ADM
exports.concluirVenda = async (req, res) => {
  try {
    const venda = await Venda.findById(req.params.id);
    if (!venda) {
      return res.status(404).json({ sucesso: false, mensagem: 'Venda não encontrada' });
    }
    if (venda.status !== 'aprovado') {
      return res.status(400).json({ sucesso: false, mensagem: 'Apenas vendas aprovadas podem ser concluídas' });
    }

    venda.status = 'concluido';
    venda.dataFinalizacao = new Date();
    await venda.save();

    res.json({ sucesso: true, venda, mensagem: 'Venda concluída com sucesso' });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};

// @desc    Cancelar venda
// @route   PUT /api/vendas/:id/cancelar
// @access  Private/ADM
exports.cancelarVenda = async (req, res) => {
  try {
    const venda = await Venda.findById(req.params.id);
    if (!venda) {
      return res.status(404).json({ sucesso: false, mensagem: 'Venda não encontrada' });
    }
    if (venda.status === 'concluido') {
      return res.status(400).json({ sucesso: false, mensagem: 'Vendas concluídas não podem ser canceladas' });
    }

    venda.status = 'cancelado';
    venda.dataFinalizacao = new Date();
    if (req.body.observacao) venda.observacao = req.body.observacao;
    await venda.save();

    res.json({ sucesso: true, venda, mensagem: 'Venda cancelada' });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: error.message });
  }
};
