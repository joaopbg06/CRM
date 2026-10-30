// Modelo de Venda - Controla vendas com status de aprovação
const mongoose = require('mongoose');

const itemVendaSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  precoUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const vendaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  itens: [itemVendaSchema],
  valorTotal: {
    type: Number,
    required: true,
    min: 0
  },
  // Status da venda: pendente (aguardando aprovação do ADM), aprovado, concluido, cancelado, recusado
  status: {
    type: String,
    enum: ['pendente', 'aprovado', 'concluido', 'cancelado', 'recusado'],
    default: 'pendente'
  },
  observacao: {
    type: String,
    trim: true
  },
  // Quem registrou a venda
  registradoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  // Quem aprovou/reprovou a venda
  aprovadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  dataAprovacao: {
    type: Date
  },
  // Data de conclusão ou cancelamento
  dataFinalizacao: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Venda', vendaSchema);
