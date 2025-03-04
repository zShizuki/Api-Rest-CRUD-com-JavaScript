/* eslint-disable import/extensions */
import express from 'express';
import videosController from '../Controllers/videosController.js';

const router = express.Router();

// Rota de busca de vídeos, deve vir primeiro
router.get('/videos', videosController.getVideo);

// Rota para obter um vídeo por ID
router.get('/videos/:id', videosController.getVideoById);

router.post('/videos', videosController.postVideo);
router.delete('/videos/:id', videosController.deleteVideo);
router.patch('/videos/:id', videosController.patchVideo);

export default router;
