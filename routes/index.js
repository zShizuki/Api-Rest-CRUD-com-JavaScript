/* eslint-disable import/extensions */
import express from 'express';
import category from './categoryRoutes.js';
import video from './videosRouter.js';

const routes = (app) => {
  app.route('/').get((_, res) => {
    res.status(200).send({ titulo: 'API Para Videos' });
  });

  app.use(
    express.json(),
    category,
    video,
  );
};

export default routes;
