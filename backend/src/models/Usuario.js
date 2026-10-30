// Modelo de Usuário para autenticação e controle de permissões
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: 6,
    select: false
  },
  tipo: {
    type: String,
    enum: ['adm', 'usuario'],
    default: 'usuario'
  },
  // Controle de permissões por tela: view (apenas visualização) ou edit (edição)
  permissoes: {
    clientes: { type: String, enum: ['nenhum', 'view', 'edit'], default: 'view' },
    produtos: { type: String, enum: ['nenhum', 'view', 'edit'], default: 'view' },
    vendas: { type: String, enum: ['nenhum', 'view', 'edit'], default: 'view' },
    usuarios: { type: String, enum: ['nenhum', 'view', 'edit'], default: 'nenhum' },
    configuracoes: { type: String, enum: ['nenhum', 'view', 'edit'], default: 'nenhum' }
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware para criptografar senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function(senhaInformada) {
  return await bcrypt.compare(senhaInformada, this.senha);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
