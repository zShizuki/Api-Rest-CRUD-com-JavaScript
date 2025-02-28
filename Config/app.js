/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
// # file responsible for connect server.js
// imports libs and files.
import express from 'express';
import router from '../Routers/router.js';

const app = express();
const route = router();

// middlewares

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.json());

app.use(route);

export default app;
