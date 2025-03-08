/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import Video from '../../classes/models/videos';
import QueryPromise from '../../utils/queryPromise';
import NotFoundError from '../../classes/errors/NotFoundError';
import BadRequestError from '../../classes/errors/badRequestError';

beforeEach(() => {
  global.console.error = jest.fn();
});

afterEach(() => {
  global.console.error.mockRestore();
});

describe('Testando métodos estáticos', () => {
  describe('Videos metodo listarTodos', () => {
    it('Deve listar todos Videos', async () => {
      jest.spyOn(QueryPromise, 'selectAll').mockReturnValue([
        { id: 1, nome: 'Categoria 1' },
        { id: 2, nome: 'Categoria 2' },
      ]);

      const response = await Video.listarTodos();

      expect(response).toEqual([
        { id: 1, nome: 'Categoria 1' },
        { id: 2, nome: 'Categoria 2' },
      ]);

      expect(QueryPromise.selectAll).toHaveBeenCalledTimes(1);
      expect(QueryPromise.selectAll).toHaveBeenCalledWith('informacoes');
    });

    describe('ERROS in listarTodos Videos', () => {
      it('Deve dar erro caso não ache nada', async () => {
        jest.spyOn(QueryPromise, 'selectAll').mockResolvedValue([]);
        await expect(Video.listarTodos()).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe('Videos metodo criar', () => {
    it('Deve criar um objeto com suceso', async () => {
      const objeto = {
        titulo: 'titulo', url: 'teste', descricao: 'teste', categoriaId: 1,
      };
      jest.spyOn(QueryPromise, 'constructPromise').mockResolvedValue({ insertId: 1 });
      jest.spyOn(QueryPromise, 'selectFromId').mockResolvedValue([{ ...objeto, id: 1 }]);
      const video = new Video(objeto);
      const response = await video.criar();
      expect(response).toEqual(expect.objectContaining(objeto));

      expect(QueryPromise.selectFromId).toHaveBeenCalledTimes(1);
      expect(QueryPromise.selectFromId).toHaveBeenCalledWith(1, 'informacoes');
    });

    describe('ERRORS in criar Videos', () => {
      it('Deve dar erro ao nao pegar insertId', async () => {
        jest.spyOn(QueryPromise, 'constructPromise').mockResolvedValue({ insertId: null });

        const response = new Video({ titulo: 'teste', url: 'teste' });
        await expect(response.criar()).rejects.toThrow(NotFoundError);

        jest.restoreAllMocks(); // Garante que os mocks são restaurados
      });
    });
  });

  describe('Videos metodo pegarPeloId', () => {
    it('Deve pegar video por id', async () => {
      jest.spyOn(QueryPromise, 'selectFromId').mockResolvedValue([
        { ID: 12, titulo: 'Fds', url: 'url' },
      ]);

      const response = await Video.pegarPeloId(12);
      expect(response).toEqual({ ID: 12, titulo: 'Fds', url: 'url' });
      expect(QueryPromise.selectFromId).toHaveBeenCalledTimes(1);
      expect(QueryPromise.selectFromId).toHaveBeenCalledWith(12, 'informacoes');

      jest.restoreAllMocks();
    });

    describe('ERROS in pegarPeloId Videos', () => {
      it('Deve dar erro ao mandar id invalido no parametro', async () => {
        await expect(Video.pegarPeloId()).rejects.toThrow(BadRequestError);
      });
    });
  });

  describe('Videos metodo atualizar', () => {
    it('Deve atualizar categoria', async () => {
      const esperado = {
        titulo: 'testeAtualizado',
        url: 'teste',
      };

      jest.fn(QueryPromise, 'constructPromise');
      jest.spyOn(QueryPromise, 'selectFromId').mockResolvedValue(esperado);

      const antigo = { titulo: 'teste', url: 'teste' };
      const novo = new Video({ ...antigo, titulo: 'testeAtualizado' });
      const response = await novo.atualizar(2);

      expect(response).toEqual(expect.objectContaining(esperado));
      expect(QueryPromise.selectFromId).toHaveBeenCalledTimes(1);
      expect(QueryPromise.selectFromId).toHaveBeenCalledWith(2, 'informacoes');

      jest.restoreAllMocks();
    });

    describe('ERROS in atualizar Videos', () => {
      it('Deve dar erro com query errado ao atualizar', async () => {
        jest.spyOn(QueryPromise, 'selectFromId').mockImplementation(() => {
          throw new NotFoundError();
        });

        const novo = new Video({ titulo: 'testeAtualizado' });

        await expect(novo.atualizar(2)).rejects.toThrow(NotFoundError);

        jest.restoreAllMocks(); // Garante que os mocks são restaurados
      });
    });
  });

  describe('Videos metodo deletar', () => {
    it('Deve deletar categoria', async () => {
      jest.spyOn(QueryPromise, 'deleteFromId').mockReturnValue({ message: 'deleted successfully' });
      const response = await Video.deletar(1);

      expect(response).toEqual({ message: 'deleted successfully' });
      expect(QueryPromise.deleteFromId).toHaveBeenCalledTimes(1);
      expect(QueryPromise.deleteFromId).toHaveBeenCalledWith(1, 'informacoes');
    });

    describe('ERROS in deletar Videos', () => {
      it('Deve dar erro ao tentar deletar uma categoria sendo usada em um video', async () => {
        jest.spyOn(QueryPromise, 'deleteFromId').mockImplementation(() => { throw new Error('ER_ROW_IS_REFERENCED_2'); });

        await expect(Video.deletar(1)).rejects.toThrow(BadRequestError);
      });
    });
  });
});
