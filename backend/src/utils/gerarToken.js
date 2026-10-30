// Função para gerar token JWT
const jwt = require('jsonwebtoken');

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = gerarToken;
