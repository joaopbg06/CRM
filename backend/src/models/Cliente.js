// Modelo de Cliente
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do cliente é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  telefone: {
    type: String,
    trim: true
  },
  endereco: {
    rua: String,
    numero: String,
    bairro: String,
    cidade: String,
    cep: String
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cliente', clienteSchema);
