/* eslint-disable import/extensions */
import Category from '../models/categoria.js';
import QueryPromise from '../utils/queryPromise.js';

class CategoryController {
  static getCategory = async (req, res) => {
    try {
      const response = await Category.listarTodos();
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to retrieve data from table' });
    }
  };

  static getCategoryById = async (req, res) => {
    try {
      const { params } = req;
      const resultado = await Category.pegarPeloId(params.id);
      res.json(resultado);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || 'Failed to retrieve category' });
    }
  };

  static postCategory = async (req, res) => {
    try {
      const { body } = req;
      if (Array.isArray(body)) {
        throw new Error('Use an object instead of an array');
      }
      if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
        throw new Error('Empty request body');
      }
      const { titulo, cor } = body;
      if (!titulo || !cor) {
        throw new Error('Missing required fields: "titulo" and "cor" are required.');
      }
      const category = new Category(body);
      const response = await category.criar();
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Failed to create category' });
    }
  };

  static deleteCategory = async (req, res) => {
    try {
      const { params } = req;
      const response = await Category.deletar(params.id);
      res.send(response);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Failed to delete category' });
    }
  };

  static patchCategory = async (req, res) => {
    try {
      const { params } = req;
      const { body } = req;
      const { titulo, cor } = body;
      if (!titulo && !cor) throw new Error('Missing fields to update: "titulo" or "cor" are required.');
      const antigo = await Category.pegarPeloId(params.id);
      const novo = new Category({ ...antigo, ...body });
      const novoNoBD = await novo.atualizar(params.id);
      res.json(novoNoBD);
    } catch (error) {
      console.error('In patchCategory', error);
      res.status(500).json({ error: error.message || 'Failed to update category' });
    }
  };

  static getVideoByCategory = async (req, res) => {
    try {
      const { params } = req;
      const response = await QueryPromise.constructPromise('SELECT * FROM informacoes WHERE categoriaId = ?', [params.id]);
      if (Array.isArray(response) && response.length === 0) throw new Error('No videos found using the ID of this category');
      res.json(response);
    } catch (error) {
      console.error('In getVideoByCategory', error);
      res.status(500).json({ error: error.message || 'Failed to retrieve videos by category' });
    }
  };
}

export default CategoryController;
