/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';
import app from '../../Config/app.js';
import Video from '../../classes/models/videos.js';
import Categoria from '../../classes/models/categoria.js';
import QueryPromise from '../../utils/queryPromise.js';

dotenv.config();
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

const token = process.env.TOKEN;
describe('POST in /videos', () => {
  it('Deve criar um video', async () => {
    const criado = await request(app)
      .post('/videos')

      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'testando', url: 'http', descricao: 'desc', categoriaId: 1,
      })
      .expect(201);

    idCriado = criado.body.ID;
    tituloCriado = criado.body.titulo;
  });

  describe('POST ERRORS in /videos', () => {
    it('Deve dar erro ao acessar sem token', async () => {
      await request(app)
        .post('/categorias')
        .send({ nada: 'teste', nada2: 'ola' })
        .expect(401);
    });

    it('Deve dar erro ao tentar criar com o body vazio', async () => {
      await request(app)
        .post('/videos')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });

    it('Deve dar erro ao mandar um objeto sem titulo e url', async () => {
      await request(app)
        .post('/videos')

        .set('Authorization', `Bearer ${token}`)
        .send({ nada: 'teste', nada2: 'ola' })
        .expect(400);
    });

    it('Deve dar erro ao mandar um array', async () => {
      await request(app)
        .post('/videos')

        .set('Authorization', `Bearer ${token}`)
        .send([{ nada: 'teste', cor: 'ola' }])
        .expect(400);
    });

    test.each([
      ['titulo', { titulo: 'teste' }],
      ['url', { url: 'teste' }],
    ])('Deve dar erro ao mandar só testando %s', async (_, param) => {
      await request(app)
        .post('/videos')

        .set('Authorization', `Bearer ${token}`)
        .send(param)
        .expect(400);
    });
  });
});

describe('GET em /videos', () => {
  it('Deve retornar array com objetos', async () => {
    await request(app)
      .get('/videos')

      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)

      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  jest.spyOn(Video, 'listarPorTitulo');
  it('Deve retornar array com objetos no ?search=', async () => {
    await request(app)
      .get(`/videos/?search=${tituloCriado}`)

      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);

    expect(Video.listarPorTitulo).toHaveBeenCalled();
  });

  it('Deve retornar um array no paginar /videos/?page=', async () => {
    jest.spyOn(Video, 'paginar');
    await request(app)
      .get('/videos/?page=1')
      .set('Authorization', `Bearer ${token}`)
      .expect('content-type', /json/)
      .expect(200);

    expect(Video.paginar).toHaveBeenCalledTimes(1);
    expect(Video.paginar).toHaveBeenCalledWith(0);
  });

  describe('ERRORS GET in videos', () => {
    it('Deve retornar erro ao buscar titulo inexistente', async () => {
      await request(app)
        .get('/videos/?search=?*/}')

        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(Video.listarPorTitulo).toHaveBeenCalled();
    });

    it('Deve retornar erro caso page nan', async () => {
      jest.spyOn(Video, 'paginar');
      await request(app)
        .get('/videos/?page=a')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(Video.paginar).toHaveBeenCalled();

      jest.restoreAllMocks();
    });
  });
});

describe('GET em /videos/free', () => {
  it('Deve retornar os 10 primeiros videos sem precisar de autenticacao', async () => {
    await request(app)
      .get('/videos/free')
      .expect(200);
  });

  describe('ERROR GET in /videos/free', () => {
    it('Deve retornar erro caso retorne array vazio', async () => {
      jest.spyOn(QueryPromise, 'constructPromise').mockResolvedValue([]);

      await request(app)
        .get('/videos/free')
        .expect(404);

      expect(QueryPromise.constructPromise).toHaveBeenCalledTimes(1);
      jest.restoreAllMocks();
    });
  });
});

describe('GET em /videos/id', () => {
  it('Deve pegar o array do id', async () => {
    await request(app)
      .get(`/videos/${idCriado}`)

      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  describe('ERRORS GET in /videos/id', () => {
    it('Deve retornar erro ao buscar ID inexistente', async () => {
      await request(app)
        .get(`/videos/${idCriado + 1}`)

        .set('Authorization', `Bearer ${token}`)
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

      .set('Authorization', `Bearer ${token}`)
      .send(param)
      .expect(200);

    expect(Video.prototype.atualizar).toHaveBeenCalled();
    expect(Video.prototype.atualizar).toHaveBeenCalledWith(String(idCriado));
  });

  describe('ERRORS in PATCH /videos/id', () => {
    it('Deve dar erro ao tentar atualizar body vazio', async () => {
      await request(app)
        .patch(`/videos/${idCriado}`)

        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
      expect(Video.prototype.atualizar).toHaveBeenCalledTimes(4);
      expect(Video.prototype.atualizar).toHaveBeenCalledWith(String(idCriado));
    });

    it('Deve retornar erro ao tentar atualizar um campo que não existe', async () => {
      await request(app)
        .patch(`/videos/${idCriado}`)

        .set('Authorization', `Bearer ${token}`)
        .send({ naoExisteEsseCampo: 'nada' })
        .expect(400);
    });

    it('Deve retornar erro ao tentar atualizar com um dos campos vazios', async () => {
      await request(app)
        .patch(`/videos/${idCriado}`)

        .set('Authorization', `Bearer ${token}`)
        .send({ titulo: 'aquiOk', url: '' })
        .expect(400);
    });
  });
});

describe('DELETE in /videos/id', () => {
  it('Deve deletar um video', async () => {
    await request(app)
      .delete(`/videos/${idCriado}`)

      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  describe('ERRORS in DELETE /videos', () => {
    it('Deve dar erro ao tentar deletar id que não existe', async () => {
      const ultimoId = Math.max(...todosVideos.map((video) => video.ID));
      const idVideoNaoExiste = ultimoId + 1;
      await request(app)
        .delete(`/videos/${idVideoNaoExiste}`)

        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('Deve dar erro ao tentar deletar o id 1', async () => {
      await request(app)
        .delete('/videos/1')

        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });
});
