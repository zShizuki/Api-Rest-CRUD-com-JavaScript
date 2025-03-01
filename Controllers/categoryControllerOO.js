/* eslint-disable import/extensions */
import Category from '../models/categoria.js';

class CategoryController {
  static getCategory = async (req, res) => {
    try {
      const response = await Category.listarTodos();
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Falha ao buscar na tabela' });
    }
  };

  static getCategoryById = async (req, res) => {
    try {
      const { params } = req;
      const resultado = await Category.pegarPeloId(params.id);
      console.log(resultado);
      res.send(201).json(resultado);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || 'Falha ao buscar categoria' });
    }
  };

  static postCategory = async (req, res) => {
    try {
      const { body } = req;

      if (Array.isArray(body)) {
        throw new Error('Use an object instead of a array');
      }

      if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
        throw new Error('Empty Body');
      }

      const { titulo, cor } = body;
      if (!titulo || !cor) {
        throw new Error('Campos obrigatórios ausentes: "titulo" e "cor" são necessários.');
      }

      const category = new Category(body);
      const response = await category.criar();

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Falha ao criar categoria' });
    }
  };
}

export default CategoryController;
