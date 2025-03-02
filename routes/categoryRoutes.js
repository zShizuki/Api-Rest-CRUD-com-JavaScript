/* eslint-disable import/extensions */
import express from 'express';
import CategoryController from '../Controllers/categoryController.js';

const router = express.Router();

router
  .get('/categorias', CategoryController.getCategory)
  .get('/categorias/:id', CategoryController.getCategoryById)
  .post('/categorias', CategoryController.postCategory)
  .delete('/categorias/:id', CategoryController.deleteCategory)
  .patch('/categorias/:id', CategoryController.patchCategory)
  .get('/categorias/:id/videos', CategoryController.getVideoByCategory);

export default router;
