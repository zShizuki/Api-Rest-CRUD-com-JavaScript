/* eslint-disable import/extensions */
import express from 'express';
import CategoryController from '../Controllers/categoryControllerOO.js';

const router = express.Router();

router
  .get('/categorias', CategoryController.getCategory)
  .get('/categorias/:id', CategoryController.getCategoryById)
  .post('/categorias', CategoryController.postCategory);

export default router;
