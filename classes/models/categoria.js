/* eslint-disable import/extensions */
import BadRequestError from '../errors/badRequestError.js';
import QueryPromise from '../../utils/queryPromise.js';
import NotFoundError from '../errors/notFoundError.js';

class Categoria {
  constructor({
    ID,
    titulo,
    cor,
  }) {
    this.ID = ID || null;
    this.titulo = titulo;
    this.cor = cor;
  }

  static async listarTodos() {
    try {
      const response = await QueryPromise.selectAll('categoria');
      if (Array.isArray(response) && !(response.length > 0)) throw new NotFoundError('Some error occurred in query for select All');
      return response;
    } catch (error) {
      // Captura erros de consulta ao banco ou outros problemas
      console.error('Error in listar todos:', error.message);
      throw error;
    }
  }

  static async pegarPeloId(id) {
    try {
      if (!id) {
        throw new BadRequestError('Invalid ID provided');
      }

      const resultado = await QueryPromise.selectFromId(id, 'categoria');
      // Se o resultado for vazio (não encontrou categoria)
      if (Array.isArray(resultado) && resultado.length === 0) {
        throw new NotFoundError(`Category with ID ${id} not found`);
      }

      return resultado[0];
    } catch (error) {
      console.error('Error in pegarPeloId:', error.message);
      throw error;
    }
  }

  static async paginar(page) {
    try {
      if (typeof page !== 'number' || !Number.isInteger(page) || page < 0) {
        throw new BadRequestError('query page must be a non-negative integer');
      }

      const response = await QueryPromise.constructPromise('SELECT * FROM categoria ORDER BY id LIMIT 5 OFFSET ?', [page]);

      return response;
    } catch (error) {
      console.error('Error in paginar:', error.message);
      throw error;
    }
  }

  static async deletar(id) {
    try {
      const deleteQuery = await QueryPromise.deleteFromId(id, 'categoria');
      return deleteQuery;
    } catch (error) {
      // Tratar erro específico de chave estrangeira
      if (error.message.includes('ER_ROW_IS_REFERENCED_')) {
        throw new BadRequestError("You can't delete a category that is being used in a video");
      }
      console.error('Error in deletar:', error.message);
      throw error;
    }
  }

  async atualizar(id) {
    try {
      QueryPromise.constructPromise(`UPDATE ${'categoria'} SET titulo = ?, cor = ? WHERE ID = ?;`, [this.titulo, this.cor, id]);
      const objetoAtualizado = QueryPromise.selectFromId(id, 'categoria');
      return objetoAtualizado;
    } catch (error) {
      console.error('Error in atualizar:', error.message);
      throw error;
    }
  }

  async criar() {
    const { insertId } = await QueryPromise.constructPromise('INSERT INTO categoria(titulo, cor) VALUES (?, ?)', [this.titulo, this.cor]);

    if (!insertId) {
      throw new NotFoundError('Erro ao obter insertId');
    }

    const response = await QueryPromise.selectFromId(insertId, 'categoria');
    return response[0];
  }
}

export default Categoria;
