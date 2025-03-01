/* eslint-disable import/extensions */
import express from 'express';
import category from './categoryRoutes.js';

const routes = (app) => {
  app.route('/').get((_, res) => {
    res.status(200).send({ titulo: 'API Para Videos' });
  });

  app.use(
    express.json(),
    category,
  );
};

export default routes;
