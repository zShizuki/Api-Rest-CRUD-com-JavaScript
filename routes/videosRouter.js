/* eslint-disable import/extensions */
import express from 'express';
import videosController from '../Controllers/videosController.js';
import JwtController from '../Controllers/jwtController.js';

const router = express.Router();

router.get('/videos/free', videosController.getVideoFree);
router.get('/videos', videosController.getVideo);
router.get('/videos/:id', videosController.getVideoById);
router.post('/videos', videosController.postVideo);
router.delete('/videos/:id', videosController.deleteVideo);
router.patch('/videos/:id', videosController.patchVideo);

export default router;
