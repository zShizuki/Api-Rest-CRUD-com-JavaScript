/* eslint-disable import/extensions */
import express from 'express';
import CategoryController from '../Controllers/categoryController.js';

const router = express.Router();

router.get('/categorias/', CategoryController.getCategory);// Rota para pegar todas as categorias
router.get('/categorias/:id', CategoryController.getCategoryById); // Rota para buscar uma categoria por ID
router.post('/categorias', CategoryController.postCategory);// Rota para criar uma categoria
router.delete('/categorias/:id', CategoryController.deleteCategory); // Rota para deletar uma categoria
router.patch('/categorias/:id', CategoryController.patchCategory); // Rota para atualizar uma categoria
router.get('/categorias/:id/videos', CategoryController.getVideoByCategory); // Rota para buscar vídeos por ID de categoria)

export default router;
