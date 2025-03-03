/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import {
  describe, it, jest,
} from '@jest/globals';
import request from 'supertest';
import app from '../../Config/app.js';
import Categoria from '../../classes/models/categoria.js';

let server;
beforeEach(() => {
  global.console.error = jest.fn();
  const port = 3000;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
  global.console.error.mockRestore();
});

let idCriado;
describe('POST em /categorias', () => {
  it('Deve criar uma nova categoria', async () => {
    const criado = await request(app)
      .post('/categorias')
      .send({
        titulo: 'Testando 1',
        cor: 'red',
      })
      .expect(201);

    idCriado = criado.body.ID;
  });
});

describe('GET em /categorias', () => {
  it('Deve retornar array com objetos', async () => {
    await request(app)
      .get('/categorias')
      .set('Accept', 'aplication/json')
      .expect('content-type', /json/)
      .expect(200);
  });
});

describe('GET em /categorias/id', () => {
  it('Deve pegar o array do id', async () => {
    await request(app)
      .get(`/categorias/${idCriado}`)
      .expect(200);
  });
});

describe('PATCH em categoria/id', () => {
  test.each([
    ['titulo', { titulo: 'TestandoPatch' }],
    ['cor', { cor: 'blue' }],
  ])('Deve alterar %s', async (_, param) => {
    await request(app)
      .patch(`/categorias/${idCriado}`)
      .send(param)
      .expect(200);
  });

  describe('PATCH ERRORS categorias', () => {
    it('Deve dar erro ao tentar criar um objeto vazio', async () => {
      await request(app)
        .patch(`/categorias/${idCriado}`)
        .send({})
        .expect(400);
    });

    it('Deve dar erro ao mandar um objeto sem titulo e cor', async () => {
      await request(app)
        .patch(`/categorias/${idCriado}`)
        .send({ nada: 'teste', nada2: 'ola' })
        .expect(400);
    });

    it('Deve retornar erro caso tenha um objeto correto e outro vazio', async () => {
      await request(app)
        .patch(`/categorias/${idCriado}`)
        .send({ titulo: 'ok', cor: '' })
        .expect(400);
    });
  });
});

describe('DELETE em categoria/id', () => {
  it('Deve deletar o objeto', async () => {
    await request(app)
      .delete(`/categorias/${idCriado}`)
      .expect(200);
  });

  describe('DELETE ERRORS categorias', () => {
    it('Deve dar erro ao tentar deletar id que não existe', async () => {
      const todos = await Categoria.listarTodos();
      const last = todos.length;
      const lastId = todos[last - 1].ID;
      await request(app)
        .delete(`/categorias/${lastId + 1}`)
        .expect(404);
    });

    it('Deve dar erro ao tentar deletar o id 1', async () => {
      await request(app)
        .delete('/categorias/1')
        .expect(400);
    });

    it('Deve dar erro ao tentar deletar um id sendo usado em video', async () => {
      await request(app)
        .delete('/categorias/1')
        .expect(400);
    });
  });
});
