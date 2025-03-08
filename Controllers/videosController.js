/* eslint-disable import/extensions */
import { query } from 'express';
import BadRequestError from '../classes/errors/badRequestError.js';
import Video from '../classes/models/videos.js';
import QueryPromise from '../utils/queryPromise.js';

class VideosController {
  static getVideo = async (req, res) => {
    try {
      const { search, page } = req.query;

      if (page) {
        const limite = 5;

        const inicio = page * limite;

        const response = await Video.paginar(inicio);

        return res.json(response);
      }

      if (search) {
        const response = await Video.listarPorTitulo(search);
        return res.json(response);
      }

      const response = await Video.listarTodos();
      return res.json(response);
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve data from table' });
    }
  };

  static getVideoById = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await Video.pegarPeloId(id);
      res.json(resultado);
    } catch (error) {
      console.error('Error in getVideoById', error);
      res.status(error.statusCode || 500).send({ error: error.message || 'Failed to retrieve video' });
    }
  };

  static getVideoFree = async (req, res) => {
    try {
      const response = await QueryPromise.constructPromise('SELECT * FROM informacoes LIMIT 10');
      res.json(response);
    } catch (error) {
      console.error('Error in getVideoFree', error);
      res.status(error.statusCode || 500).send({ error: error.message || 'Failed to retrieve video' });
    }
  };

  static postVideo = async (req, res) => {
    try {
      const { body } = req;
      if (Array.isArray(body)) {
        throw new BadRequestError('Use an object instead of an array');
      }
      if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
        throw new BadRequestError('Empty request body');
      }
      const { titulo, url } = body;
      if (!titulo || !url) {
        throw new BadRequestError('Missing required fields: "titulo" and "url" are required.');
      }

      const video = new Video(body);
      const response = await video.criar();
      res.status(201).json(response);
    } catch (error) {
      console.error('Error in postVideo', error);
      res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create video' });
    }
  };

  static deleteVideo = async (req, res) => {
    try {
      const { params } = req;
      const response = await Video.deletar(params.id);
      res.send(response);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Failed to delete video' });
    }
  };

  static patchVideo = async (req, res) => {
    try {
      const { params } = req;
      const { body } = req;
      const {
        titulo, url, descricao, categoriaId,
      } = body;

      const fields = [titulo, url, descricao, categoriaId];

      // Verifica se todos os campos são undefined
      if (!fields.some((x) => x !== undefined)) {
        throw new BadRequestError('At least one field ("titulo", "descricao", "url", or "categoriaId") is required.');
      }

      // Verifica se algum campo foi enviado, mas está vazio
      if (fields.some((x) => x !== undefined && String(x).trim() === '')) {
        throw new BadRequestError('Fields "titulo", "descricao", "url", and "categoriaId" cannot be empty.');
      }

      const antigo = await Video.pegarPeloId(params.id);
      const novo = new Video({ ...antigo, ...body });
      const novoNoBD = await novo.atualizar(params.id);
      res.json(novoNoBD);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Failed to update video' });
    }
  };
}

export default VideosController;
