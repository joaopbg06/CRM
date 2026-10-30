// Modelo de Produto
const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true
  },
  descricao: {
    type: String,
    trim: true
  },
  preco: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: 0
  },
  estoque: {
    type: Number,
    default: 0,
    min: 0
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Produto', produtoSchema);
