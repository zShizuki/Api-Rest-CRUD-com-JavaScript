/* eslint-disable import/extensions */
import Categoria from '../classes/models/categoria.js';
import Video from '../classes/models/videos.js';

class VideosController {
  static getVideo = async (req, res) => {
    try {
      const response = await Video.listarTodos();
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to retrieve data from table' });
    }
  };

  static getVideoById = async (req, res) => {
    try {
      const { params } = req;
      const resultado = await Video.pegarPeloId(params.id);
      res.json(resultado);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || 'Failed to retrieve video' });
    }
  };

  static postVideo = async (req, res) => {
    try {
      const { body } = req;
      if (Array.isArray(body)) {
        throw new Error('Use an object instead of an array');
      }
      if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
        throw new Error('Empty request body');
      }
      const { titulo, url } = body;
      if (!titulo || !url) {
        throw new Error('Missing required fields: "titulo" and "url" are required.');
      }
      const video = new Video(body);
      const response = await video.criar();
      res.status(201).json(response);
    } catch (error) {
      console.error('Error in postVideo', error);
      res.status(500).json({ error: error.message || 'Failed to create video' });
    }
  };

  static deleteVideo = async (req, res) => {
    try {
      const { params } = req;
      const response = await Video.deletar(params.id);
      res.send(response);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Failed to delete video' });
    }
  };

  static patchVideo = async (req, res) => {
    try {
      const { params } = req;
      const { body } = req;
      const {
        titulo, url, descricao, categoriaId,
      } = body;
      if (!titulo && !url && !descricao && !categoriaId) {
        throw new Error('Missing fields to update: "titulo", "descricao", "url" or "categoriaId" are required.');
      }
      if (categoriaId && !(await Categoria.pegarPeloId(categoriaId))) {
        throw new Error(`Cannot add category ID ${categoriaId} as it does not exist.`);
      }
      const antigo = await Video.pegarPeloId(params.id);
      const novo = new Video({ ...antigo, ...body });
      const novoNoBD = await novo.atualizar(params.id);
      res.json(novoNoBD);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Failed to update video' });
    }
  };
}

export default VideosController;
