/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import request from 'supertest';
import app from '../../Config/app.js';
import Video from '../../classes/models/videos.js';
import Categoria from '../../classes/models/categoria.js';

let server;
const todosVideos = await Video.listarTodos();
const todosCategorias = await Categoria.listarTodos();
let idCriado;
let tituloCriado;

beforeEach(() => {
  global.console.error = jest.fn();
  const port = 3001;
  server = app.listen(port);
});
afterEach(() => {
  server.close();
  global.console.error.mockRestore();
});

describe('POST in /videos', () => {
  it('Deve criar um video', async () => {
    const criado = await request(app)
      .post('/videos')
      .send({
        titulo: 'testando', url: 'http', descricao: 'desc', categoriaId: 1,
      })
      .expect(201);

    idCriado = criado.body.ID;
    tituloCriado = criado.body.titulo;
  });

  describe('POST ERRORS in /videos', () => {
    it('Deve dar erro ao tentar criar com o body vazio', async () => {
      await request(app)
        .post('/videos')
        .send({})
        .expect(400);
    });

    it('Deve dar erro ao mandar um objeto sem titulo e url', async () => {
      await request(app)
        .post('/videos')
        .send({ nada: 'teste', nada2: 'ola' })
        .expect(400);
    });

    it('Deve dar erro ao mandar um array', async () => {
      await request(app)
        .post('/videos')
        .send([{ nada: 'teste', cor: 'ola' }])
        .expect(400);
    });

    test.each([
      ['titulo', { titulo: 'teste' }],
      ['url', { url: 'teste' }],
    ])('Deve dar erro ao mandar só testando %s', async (_, param) => {
      await request(app)
        .post('/videos')
        .send(param)
        .expect(400);
    });
  });
});

describe('GET em /videos', () => {
  it('Deve retornar array com objetos', async () => {
    await request(app)
      .get('/videos')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
  });

  jest.spyOn(Video, 'listarPorTitulo');
  it('Deve retornar array com objetos no ?search=', async () => {
    await request(app)
      .get(`/videos/?search=${tituloCriado}`)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);

    expect(Video.listarPorTitulo).toHaveBeenCalled();
  });

  describe('ERRORS GET in videos', () => {
    it('Deve retornar erro ao buscar titulo inexistente', async () => {
      await request(app)
        .get('/videos/?search=?*/}')
        .expect(404);

      expect(Video.listarPorTitulo).toHaveBeenCalled();
    });
  });
});

describe('GET em /videos/id', () => {
  it('Deve pegar o array do id', async () => {
    await request(app)
      .get(`/videos/${idCriado}`)
      .expect(200);
  });

  describe('ERRORS GET in /videos/id', () => {
    it('Deve retornar erro ao buscar ID inexistente', async () => {
      await request(app)
        .get(`/videos/${idCriado + 1}`)
        .expect(404);
    });
  });
});

describe('PATCH in /videos/id', () => {
  test.each([
    ['titulo', { titulo: 'testandoPatch' }],
    ['descricao', { descricao: 'testandoPatch' }],
    ['url', { url: 'testandoPatch' }],
    ['categoriaId', { categoriaId: todosCategorias[1].ID }],
  ])('Deve atualizar %s', async (_, param) => {
    jest.spyOn(Video.prototype, 'atualizar');
    await request(app)
      .patch(`/videos/${idCriado}`)
      .send(param)
      .expect(200);

    expect(Video.prototype.atualizar).toHaveBeenCalled();
    expect(Video.prototype.atualizar).toHaveBeenCalledWith(String(idCriado));
  });

  describe('ERRORS in PATCH /videos/id', () => {
    it('Deve dar erro ao tentar atualizar body vazio', async () => {
      await request(app)
        .patch(`/videos/${idCriado}`)
        .send({})
        .expect(400);
      expect(Video.prototype.atualizar).toHaveBeenCalledTimes(4);
      expect(Video.prototype.atualizar).toHaveBeenCalledWith(String(idCriado));
    });

    it('Deve retornar erro ao tentar atualizar um campo que não existe', async () => {
      await request(app)
        .patch(`/videos/${idCriado}`)
        .send({ naoExisteEsseCampo: 'nada' })
        .expect(400);
    });

    it('Deve retornar erro ao tentar atualizar com um dos campos vazios', async () => {
      await request(app)
        .patch(`/videos/${idCriado}`)
        .send({ titulo: 'aquiOk', url: '' })
        .expect(400);
    });
  });
});

describe('DELETE in /videos/id', () => {
  it('Deve deletar um video', async () => {
    await request(app)
      .delete(`/videos/${idCriado}`)
      .expect(200);
  });

  describe('ERRORS in DELETE /videos', () => {
    it('Deve dar erro ao tentar deletar id que não existe', async () => {
      const ultimoId = Math.max(...todosVideos.map((video) => video.ID));
      const idVideoNaoExiste = ultimoId + 1;
      await request(app)
        .delete(`/videos/${idVideoNaoExiste}`)
        .expect(404);
    });

    it('Deve dar erro ao tentar deletar o id 1', async () => {
      await request(app)
        .delete('/videos/1')
        .expect(400);
    });
  });
});
