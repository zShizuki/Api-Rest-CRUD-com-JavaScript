/* eslint-disable import/extensions */
import express from 'express';
import videosController from '../Controllers/videosController.js';

const router = express.Router();

router
  .get('/videos', videosController.getVideo)
  .get('/videos/:id', videosController.getVideoById)
  .post('/videos', videosController.postVideo)
  .delete('/videos/:id', videosController.deleteVideo)
  .patch('/videos/:id', videosController.patchVideo);

export default router;
