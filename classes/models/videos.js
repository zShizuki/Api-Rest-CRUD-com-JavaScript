/* eslint-disable import/extensions */
import QueryPromise from '../../utils/queryPromise.js';
import BadRequestError from '../errors/badRequestError.js';
import NotFoundError from '../errors/NotFoundError.js';

class Video {
  constructor({
    ID,
    titulo,
    url,
    descricao,
    categoriaId,
  }) {
    this.ID = ID || null;
    this.titulo = titulo;
    this.url = url;
    this.descricao = descricao || 'Sem Descricao';
    this.categoriaId = categoriaId || 1;
  }

  static async listarTodos() {
    try {
      const response = await QueryPromise.selectAll('informacoes');
      if (Array.isArray(response) && !(response.length > 0)) throw new NotFoundError('Some error occurred in query for select All');
      return response;
    } catch (error) {
      console.error('Error in listar todos:', error.message);
      throw error;
    }
  }

  static async listarPorTitulo(titulo) {
    try {
      // pega todos os videos da DB
      let response = await QueryPromise.selectAll('informacoes');

      // transforma o titulo em minusculo
      const tituloLC = titulo.toLowerCase();

      // Response recebe o array filtrado com o titulo correspondente
      response = response.filter((video) => video.titulo.toLowerCase().includes(tituloLC));

      // Verifica se o array é vazio, se for joga um erro
      if (response.length === 0) throw new NotFoundError('Any videos found with this titulo');

      // Retorna array filtrado
      return response;
    } catch (error) {
      console.error('Error in listarPorTitulo:', error.message);
      throw error;
    }
  }

  static async pegarPeloId(id) {
    if (!id) {
      throw new BadRequestError('Invalid ID provided');
    }

    try {
      const resultado = await QueryPromise.selectFromId(id, 'informacoes');

      if (Array.isArray(resultado) && resultado.length === 0) {
        throw new NotFoundError(`Category with ID ${id} not found`);
      }

      return resultado[0];
    } catch (error) {
      console.error('Error in pegarPeloId:', error.message);
      throw error;
    }
  }

  static async deletar(id) {
    try {
      const deleteQuery = await QueryPromise.deleteFromId(id, 'informacoes');
      return deleteQuery;
    } catch (error) {
      if (error.message.includes('ER_ROW_IS_REFERENCED_')) {
        throw new BadRequestError("You can't delete a category that is being used in a video");
      }
      console.error('Error in deletar:', error.message);
      throw error;
    }
  }

  async atualizar(id) {
    try {
      QueryPromise.constructPromise('UPDATE informacoes SET titulo = ?, url = ?, descricao = ?, categoriaId = ? WHERE ID = ?;', [this.titulo, this.url, this.descricao, this.categoriaId, id]);
      const objetoAtualizado = await QueryPromise.selectFromId(id, 'informacoes');
      return objetoAtualizado;
    } catch (error) {
      console.error('Error in atualizar:', error.message);
      throw error;
    }
  }

  async criar() {
    try {
      const { insertId } = await QueryPromise.constructPromise('INSERT INTO informacoes(titulo, url, descricao, categoriaId) VALUES (?, ?, ?, ?)', [this.titulo, this.url, this.descricao, this.categoriaId]);

      if (!insertId) {
        throw new NotFoundError('Erro ao obter insertId');
      }

      const response = await QueryPromise.selectFromId(insertId, 'informacoes');
      return response[0];
    } catch (error) {
      console.error('Error in criar:', error.message);
      throw error;
    }
  }
}

export default Video;
