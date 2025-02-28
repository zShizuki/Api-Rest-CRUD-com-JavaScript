/* eslint-disable import/extensions */
import queryPromise from '../utils/queryPromise.js';

export default function videosController() {
  const { constructPromise, selectFromId, existsById } = queryPromise();

  const listAllVideos = async (req, res) => {
    try {
      const { search } = req.query;

      if (search) {
        const response = await constructPromise(`SELECT * FROM informacoes WHERE titulo='${search}'`);

        if (Array.isArray(response) && !response.length) {
          throw new Error('Null object returned');
        }

        res.send(response);

        return;
      }

      const response = await constructPromise('SELECT * FROM informacoes;');
      res.send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || 'Database query failed' });
    }
  };

  const getVideoById = async (req, res) => {
    try {
      const { id } = req.params; // Extrai o id da URL
      const response = await selectFromId(id, 'informacoes');

      const idExists = await existsById(id, 'informacoes');

      if (!idExists) {
        throw new Error('Video not found or not exists');
      }

      res.send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || 'Database query failed' });
    }
  };

  const deleteVideoById = async (req, res) => {
    try {
      const { id } = req.params;

      const idExists = await existsById(id, 'informacoes');

      if (!idExists) {
        throw new Error('Video not found or already deleted');
      }

      const query = await constructPromise(`DELETE FROM informacoes WHERE id = '${id}';`);

      if (query.affectedRows > 0) {
        res.json({ message: 'Video deleted successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(404).send({ error: 'Video not found or already deleted' });
    }
  };

  const createVideo = async (req, res) => {
    try {
      const request = req.body;

      if (!request || request.length === 0) {
        throw new Error('The body of request is empty');
      }

      if (Array.isArray(request)) {
        const validRequests = request.filter((element) => element.titulo && element.url);

        if (validRequests.length === 0) {
          throw new Error('No valid videos to add');
        }

        const responseVideos = await Promise.all(validRequests.map(async (element) => {
          const descricao = element.descricao || 'Sem Descricao';
          const categoriaId = element.categoriaId || 1;
          const categoriaIdExist = await existsById(categoriaId, 'categoria');

          if (!categoriaIdExist) {
            throw new Error(`Category ID does not exist for title: ${element.titulo}`);
          }

          const insertResult = await constructPromise(
            `INSERT INTO informacoes (titulo, descricao, url, categoriaId) VALUES ('${element.titulo}', '${descricao}', '${element.url}', ${categoriaId});`,
          );

          const newVideoId = insertResult.insertId;
          const [newVideo] = await selectFromId(newVideoId, 'informacoes');

          return newVideo;
        }));

        res.json(responseVideos.filter((video) => video)); // Remove valores `undefined`
      } else {
        if (!request.titulo || !request.url) {
          throw new Error('Missing titulo and url');
        }

        const descricao = request.descricao || 'Sem Descricao';
        const categoriaId = request.categoriaId || 1;

        const insertResult = await constructPromise(
          `INSERT INTO informacoes (titulo, descricao, url, categoriaId) VALUES ('${request.titulo}', '${descricao}', '${request.url}', ${categoriaId});`,
        );

        const newVideoId = insertResult.insertId;
        const newVideo = await selectFromId(newVideoId, 'informacoes');

        res.json(newVideo);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || 'Failure to Create in Database' });
    }
  };

  const patchVideo = async (req, res) => {
    try {
      const request = req.body;
      const { id } = req.params;

      const idExists = await existsById(id, 'informacoes');

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
      const camposEsperados = ['titulo', 'descricao', 'url', 'categoriaId'];

      // Filtrando os campos presentes no request
      const camposPresentes = camposEsperados.filter((campo) => request[campo] !== undefined);

      if (camposPresentes.length === 0) {
        throw new Error('Any field with title, descricao or url');
      }

      camposPresentes.forEach((campo) => {
        constructPromise(`UPDATE informacoes SET ${campo} = '${request[campo]}' where ID = ${id};`);
      });

      const response = await selectFromId(id, 'informacoes');
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.message || 'Cant update video' });
    }
  };

  return {
    listAllVideos,
    getVideoById,
    deleteVideoById,
    createVideo,
    patchVideo,
  };
}
