/* eslint-disable import/extensions */
import QueryPromise from '../utils/queryPromise.js';

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
      return response;
    } catch (error) {
      // Captura erros de consulta ao banco ou outros problemas
      console.error('Error in listar todos:', error.message);
      throw error; // Re-lança o erro para que possa ser tratado onde a função for chamada
    }
  }

  static async pegarPeloId(id) {
    if (!id) {
      console.log(id);
      throw new Error('Invalid ID provided');
    }

    try {
      const resultado = await QueryPromise.selectFromId(id, 'categoria');

      // Se o resultado for vazio (não encontrou categoria)
      if (Array.isArray(resultado) && resultado.length === 0) {
        throw new Error(`Category with ID ${id} not found`);
      }

      return resultado[0];
    } catch (error) {
      // Captura erros de consulta ao banco ou outros problemas
      console.error('Error in pegarPeloId:', error.message);
      throw error; // Re-lança o erro para que possa ser tratado onde a função for chamada
    }
  }

  async criar() {
    const { insertId } = await QueryPromise.constructPromise('INSERT INTO categoria(titulo, cor) VALUES (?, ?)', [this.titulo, this.cor]);

    if (!insertId) {
      throw new Error('Erro ao obter insertId');
    }

    const response = await QueryPromise.selectFromId(insertId, 'categoria');
    const cat = new Categoria(response[0]);
    return cat;
  }
}

export default Categoria;
