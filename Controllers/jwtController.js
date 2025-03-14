/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import BadRequestError from '../classes/errors/badRequestError.js';
import UnauthorizedError from '../classes/errors/unauthorizedError.js';

dotenv.config();

class JwtController {
  // Usar variável de ambiente para a chave secreta
  static chaveSecreta = process.env.CHAVE_SECRETA;

  static login = async (req, res) => {
    try {
      const { usuario, senha } = req.body;

      if (!usuario || !senha) {
        throw new BadRequestError('Missing fields: usuario ou senha');
      }

      // Verificação de usuário e senha (substitua por uma consulta ao banco de dados)
      if (usuario !== 'admin' || senha !== 'admin') {
        throw new BadRequestError('User or password invalid');
      }

      // Gera token válido por 1 hora
      const token = jwt.sign({ payload: { usuario } }, this.chaveSecreta, { expiresIn: '1w' });

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ error: error.message || 'Failed to authenticate' });
    }
  };

  static autenticacao = async (req, res, next) => {
    try {
      if (req.path === '/videos/free') {
        return next();
      }
      const authHeader = req.header('Authorization');

      if (!authHeader) {
        throw new UnauthorizedError('Token inválido');
      }

      // Extrai o token do cabeçalho "Bearer <token>"
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

      if (!token) {
        throw new UnauthorizedError('Token inválido');
      }

      const decoded = jwt.verify(token, this.chaveSecreta);

      if (!decoded.payload || !decoded.payload.usuario) {
        throw new UnauthorizedError('Token inválido');
      }

      // Adiciona o usuário ao request
      req.usuario = decoded.payload.usuario;
      return next();
    } catch (error) {
      console.error('Erro ao verificar o JWT:', error);
      return res.status(error.statusCode || 500).json({ error: error.message || 'Unexpected error in jwtController' });
    }
  };
}

export default JwtController;
