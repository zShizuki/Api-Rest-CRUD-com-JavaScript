/* eslint-disable import/extensions */
import express from 'express';
import JwtController from '../Controllers/jwtController.js';

const router = express.Router();

// Rota de login
router.post('/login', JwtController.login);

export default router;
