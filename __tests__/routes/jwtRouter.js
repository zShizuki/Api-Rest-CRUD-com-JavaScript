/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';
import app from '../../Config/app.js';

dotenv.config();

let server;
beforeEach(() => {
  global.console.error = jest.fn();
  const port = 3002;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
  global.console.error.mockRestore();
});

describe('POST in /login', () => {
  it('Deve executar o login com admin/admin', async () => {
    await request(app)
      .post('/login')
      .send({ usuario: 'admin', senha: 'admin' })
      .expect(200);
  });

  describe('Errors in POST login', () => {
    it('Deve dar erro ao colocar login errado', async () => {
      await request(app)
        .post('/login')
        .send({ usuario: 'nexiste', senha: '321312' });
    });
  });
});
