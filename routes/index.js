/* eslint-disable import/extensions */
import express from 'express';
import category from './categoryRoutes.js';
import video from './videosRouter.js';
import jwtRoutes from './jwtRoutes.js';
import JwtController from '../Controllers/jwtController.js';

const routes = (app) => {
  app.route('/').get((_, res) => {
    res.status(200).send({ titulo: 'API Para Videos' });
  });

  // Rota de autenticação
  app.use(
    jwtRoutes,
    JwtController.autenticacao,
    category,
    video,
  );
};

export default routes;
