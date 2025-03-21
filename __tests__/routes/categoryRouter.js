/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';
import app from '../../Config/app.js';
import Categoria from '../../classes/models/categoria.js';
import NotFoundError from '../../classes/errors/notFoundError.js';

dotenv.config();

let server;
const todos = await Categoria.listarTodos();
const last = todos.length;
const lastId = todos[last - 1].ID;
beforeEach(() => {
  global.console.error = jest.fn();
  const port = 3000;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
  global.console.error.mockRestore();
});

let objetoCriado;
let idCriado;
const token = process.env.TOKEN;
describe('POST em /categorias', () => {
  it('Deve criar uma nova categoria', async () => {
    const criado = await request(app)
      .post('/categorias')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Testando 1',
        cor: 'red',
      })
      .expect(201);

    objetoCriado = criado.body;
    idCriado = objetoCriado.ID;
  });

  describe('POST ERRORS in /categorias', () => {
    it('Deve dar erro ao tentar criar com o body vazio', async () => {
      await request(app)
        .post('/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });

    it('Deve dar erro ao acessar sem token', async () => {
      await request(app)
        .post('/categorias')
        .send({ nada: 'teste', nada2: 'ola' })
        .expect(401);
    });

    it('Deve dar erro ao mandar um objeto sem titulo e cor', async () => {
      await request(app)
        .post('/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({ nada: 'teste', nada2: 'ola' })
        .expect(400);
    });

    test.each([
      ['titulo', { titulo: 'teste' }],
      ['cor', { cor: 'teste' }],
    ])('Deve dar erro ao mandar só testando %s', async (_, param) => {
      await request(app)
        .post('/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send(param)
        .expect(400);
    });
  });

  it('Deve dar erro ao usar array', async () => {
    await request(app)
      .post('/categorias')
      .set('Authorization', `Bearer ${token}`)
      .send([{ titulo: 'teste', cor: 'teste' }])
      .expect(400);
  });
});

describe('GET em /categorias', () => {
  it('Deve retornar array com objetos', async () => {
    await request(app)
      .get('/categorias')
      .set('Authorization', `Bearer ${token}`)
      .expect('content-type', /json/)
      .expect(200);
  });

  it('Deve retornar um array no paginar /categorias/?page=', async () => {
    jest.spyOn(Categoria, 'paginar');
    await request(app)
      .get('/categorias/?page=1')
      .set('Authorization', `Bearer ${token}`)
      .expect('content-type', /json/)
      .expect(200);

    expect(Categoria.paginar).toHaveBeenCalledTimes(1);
    expect(Categoria.paginar).toHaveBeenCalledWith(0);
  });

  describe('ERROR GET in /categorias', () => {
    it('Deve retornar erro caso falhe a pesquisa no BD', async () => {
      jest.spyOn(Categoria, 'listarTodos').mockRejectedValue(new NotFoundError('DB error'));
      await request(app)
        .get('/categorias')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('Deve retornar erro caso page nan', async () => {
      jest.spyOn(Categoria, 'paginar');
      await request(app)
        .get('/categorias/?page=a')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(Categoria.paginar).toHaveBeenCalled();
    });
  });
});

describe('GET em /categorias/id', () => {
  it('Deve pegar o array do id', async () => {
    await request(app)
      .get(`/categorias/${idCriado}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  describe('ERRORS GET in categorias', () => {
    it('Deve retornar erro ao buscar ID inexistente', async () => {
      await request(app)
        .get(`/categorias/${idCriado + 1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});

describe('GET in /categorias/:id/video', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Reseta os mocks depois de cada teste
  });

  it('Deve retornar video pelo id da categoria', async () => {
    await request(app)
      .get('/categorias/1/videos')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  describe('ERROR GET in /categorias/:id/video', () => {
    it('Deve retornar erro ao buscar por categoria inexistente', async () => {
      jest.spyOn(Categoria, 'pegarPeloId').mockRejectedValue(new NotFoundError('Category not found'));

      await request(app)
        .get(`/categorias/${idCriado}/videos`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('Deve retornar erro ao buscar por id de categoria que nao esta sendo usada', async () => {
      await request(app)
        .get(`/categorias/${idCriado}/videos`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('Deve retornar erro ao buscar id NaN', async () => {
      await request(app)
        .get('/categorias/TESTE/videos')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });
});

describe('PATCH em categoria/id', () => {
  test.each([
    ['titulo', { titulo: 'TestandoPatch' }],
    ['cor', { cor: 'blue' }],
  ])('Deve alterar %s', async (_, param) => {
    await request(app)
      .patch(`/categorias/${idCriado}`)
      .set('Authorization', `Bearer ${token}`)
      .send(param)
      .expect(200);
  });

  describe('PATCH ERRORS categorias', () => {
    it('Deve dar erro ao tentar criar um objeto vazio', async () => {
      await request(app)
        .patch(`/categorias/${idCriado}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });

    it('Deve dar erro ao mandar um objeto sem titulo ou cor', async () => {
      await request(app)
        .patch(`/categorias/${idCriado}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nada: 'teste', nada2: 'ola' })
        .expect(400);
    });

    it('Deve retornar erro caso tenha um objeto correto e outro vazio', async () => {
      await request(app)
        .patch(`/categorias/${idCriado}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ titulo: 'ok', cor: '' })
        .expect(400);
    });
  });
});
describe('DELETE em categoria/id', () => {
  it('Deve deletar o objeto', async () => {
    await request(app)
      .delete(`/categorias/${idCriado}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  describe('DELETE ERRORS categorias', () => {
    it('Deve dar erro ao tentar deletar id que não existe', async () => {
      await request(app)
        .delete(`/categorias/${lastId + 1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('Deve dar erro ao tentar deletar o id 1', async () => {
      await request(app)
        .delete('/categorias/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    it('Deve dar erro ao tentar deletar um id sendo usado em video', async () => {
      await request(app)
        .delete('/categorias/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });
});
