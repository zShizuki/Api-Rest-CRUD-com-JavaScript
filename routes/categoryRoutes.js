/* eslint-disable import/extensions */
import express from 'express';
import CategoryController from '../Controllers/categoryController.js';

const router = express.Router();

router
  .get('/categorias', CategoryController.getCategory) // Rota para pegar todas as categorias
  .post('/categorias', CategoryController.postCategory) // Rota para criar uma categoria
  .delete('/categorias/:id', CategoryController.deleteCategory) // Rota para deletar uma categoria
  .patch('/categorias/:id', CategoryController.patchCategory) // Rota para atualizar uma categoria
  .get('/categorias/:id', CategoryController.getCategoryById) // Rota para buscar uma categoria por ID
  .get('/categorias/:id/videos', CategoryController.getVideoByCategory); // Rota para buscar vídeos por ID de categoria

export default router;
