// Middleware de autenticação JWT
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.proteger = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ sucesso: false, mensagem: 'Não autorizado, token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = await Usuario.findById(decoded.id).select('-senha');
    if (!req.usuario || !req.usuario.ativo) {
      return res.status(401).json({ sucesso: false, mensagem: 'Usuário não encontrado ou inativo' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ sucesso: false, mensagem: 'Não autorizado, token inválido' });
  }
};

// Middleware para verificar se é administrador
exports.apenasAdm = (req, res, next) => {
  if (req.usuario && req.usuario.tipo === 'adm') {
    next();
  } else {
    return res.status(403).json({ sucesso: false, mensagem: 'Acesso restrito apenas para administradores' });
  }
};

// Middleware para verificar permissão por tela
exports.verificarPermissao = (tela, nivel) => {
  return (req, res, next) => {
    // Administradores têm acesso total
    if (req.usuario.tipo === 'adm') {
      return next();
    }

    const permissaoUsuario = req.usuario.permissoes && req.usuario.permissoes[tela];
    
    // Verifica se tem permissão
    if (!permissaoUsuario || permissaoUsuario === 'nenhum') {
      return res.status(403).json({ sucesso: false, mensagem: 'Sem permissão para acessar esta tela' });
    }
    
    // Se precisa de edição mas tem apenas visualização
    if (nivel === 'edit' && permissaoUsuario !== 'edit') {
      return res.status(403).json({ sucesso: false, mensagem: 'Sem permissão para editar nesta tela' });
    }
    
    next();
  };
};
