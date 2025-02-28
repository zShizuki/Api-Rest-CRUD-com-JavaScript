/* eslint-disable import/extensions */
import queryPromise from '../utils/queryPromise.js';

export default function categoryController() {
  const { constructPromise, selectFromId, existsById } = queryPromise();

  const getCategory = async (req, res) => {
    try {
      const response = await constructPromise('SELECT * FROM categoria;');
      res.send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || 'Database query failed' });
    }
  };

  const getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const categoria = await selectFromId(id, 'categoria');

      if (!categoria || categoria.length === 0) {
        throw new Error('Categoria não encontrada');
      }

      const { titulo, cor } = categoria[0];
      res.json({ titulo, cor });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || 'Falha ao buscar categoria' });
    }
  };

  const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;

      if (id === 1) throw new Error('Cant delete category with id 1');

      const idExists = await existsById(id, 'categoria');

      if (!idExists) {
        throw new Error('Category not found or already deleted');
      }

      const query = await constructPromise(`DELETE FROM categoria WHERE id = '${id}';`);

      if (query.affectedRows > 0) {
        res.json({ message: 'Category deleted successfully' });
      }
    } catch (error) {
      if (error.message.includes('ER_ROW_IS_REFERENCED_')) error.message = "You can't delete a category how is being used in a video";
      console.error(error);
      res.status(404).send({ error: error.message || 'Video not found or already deleted' });
    }
  };

  const postCategory = async (req, res) => {
    try {
      const request = req.body;

      if (Array.isArray(request)) throw new Error('Use an object instead');

      // Verifica se o req.body está vazio ou não é um array
      if (!request || request.length === 0) {
        throw new Error('The body of request is empty');
      }

      if (!request.titulo || !request.cor) {
        throw new Error('Missing titulo or cor');
      }

      const insertResult = await constructPromise(
        `INSERT INTO categoria (titulo, cor) VALUES ('${request.titulo}', '${request.cor}');`,
      );

      const newCategoryId = insertResult.insertId;
      const newCategory = await selectFromId(newCategoryId, 'categoria');

      await res.json(newCategory);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || 'Failure to Create in Database' });
    }
  };

  const patchCategory = async (req, res) => {
    try {
      const request = req.body;
      const { id } = req.params;

      const idExists = await existsById(id, 'categoria');

      if (!idExists) {
        throw new Error('ID not found in database');
      }

      if (!request || Object.keys(request).length === 0) {
        throw new Error('The body of request is empty');
      }

      if (Array.isArray(request)) {
        throw new Error('Use an object instead of a array');
      }

      // Definindo os campos esperados
      const camposEsperados = ['cor', 'titulo'];

      // Filtrando os campos presentes no request
      const camposPresentes = camposEsperados.filter((campo) => request[campo] !== undefined);

      if (camposPresentes.length === 0) {
        throw new Error('Any field with title, descricao or url');
      }

      camposPresentes.forEach((campo) => {
        constructPromise(`UPDATE categoria SET ${campo} = '${request[campo]}' where ID = ${id};`);
      });

      const response = await selectFromId(id, 'categoria');
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.message || 'Cant update video' });
    }
  };

  const getVideoByCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await constructPromise(`SELECT * FROM informacoes WHERE categoriaId = ${id}`);

      const idExists = await existsById(id, 'categoria');

      if (!idExists) {
        throw new Error('ID not found in database');
      }

      if (result.length === 0) throw new Error('Any video using this id');

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.message || 'Cant update video' });
    }
  };

  return {
    getCategoryById,
    getCategory,
    deleteCategory,
    postCategory,
    patchCategory,
    getVideoByCategory,
  };
}
