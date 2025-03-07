/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import Categoria from '../../classes/models/categoria';
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
  describe('Categorias metodo listarTodos', () => {
    it('Deve listar todas Categorias', async () => {
      jest.spyOn(QueryPromise, 'selectAll').mockReturnValue([
        { id: 1, nome: 'Categoria 1' },
        { id: 2, nome: 'Categoria 2' },
      ]);

      const response = await Categoria.listarTodos();

      expect(response).toEqual([
        { id: 1, nome: 'Categoria 1' },
        { id: 2, nome: 'Categoria 2' },
      ]);

      expect(QueryPromise.selectAll).toHaveBeenCalledTimes(1);
      expect(QueryPromise.selectAll).toHaveBeenCalledWith('categoria');
    });

    describe('ERROS in listarTodos Categorias', () => {
      it('Deve dar erro caso não ache nada', async () => {
        jest.spyOn(QueryPromise, 'selectAll').mockResolvedValue([]);
        await expect(Categoria.listarTodos()).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe('Categorias metodo criar', () => {
    // FAZER METODO CRIAR FUNCIONANDO

    // FAZER METODO CRIAR FUNCIONANDO

    // FAZER METODO CRIAR FUNCIONANDO

    describe('ERRORS in criar Categorias', () => {
      it('Deve dar erro ao nao pegar insertId', async () => {
        jest.spyOn(QueryPromise, 'constructPromise').mockResolvedValue({ insertId: null });

        const response = new Categoria({ titulo: 'teste', cor: 'teste' });
        await expect(response.criar()).rejects.toThrow(NotFoundError);

        jest.restoreAllMocks(); // Garante que os mocks são restaurados
      });
    });
  });

  describe('Categorias metodo pegarPeloId', () => {
    it('Deve pegar categoria por id', async () => {
      jest.spyOn(QueryPromise, 'selectFromId').mockResolvedValue([
        { ID: 12, titulo: 'Aviacao', cor: 'white' },
      ]);

      const response = await Categoria.pegarPeloId(12);
      expect(response).toEqual({ ID: 12, titulo: 'Aviacao', cor: 'white' });
      expect(QueryPromise.selectFromId).toHaveBeenCalledTimes(1);
      expect(QueryPromise.selectFromId).toHaveBeenCalledWith(12, 'categoria');

      jest.restoreAllMocks();
    });

    describe('ERROS in pegarPeloId Categorias', () => {
      it('Deve dar erro ao mandar id invalido no parametro', async () => {
        await expect(Categoria.pegarPeloId()).rejects.toThrow(BadRequestError);
      });
    });
  });

  describe('Categorias metodo atualizar', () => {
    it('Deve atualizar categoria', async () => {
      const esperado = {
        titulo: 'testeAtualizado',
        cor: 'teste',
      };

      jest.fn(QueryPromise, 'constructPromise');
      jest.spyOn(QueryPromise, 'selectFromId').mockResolvedValue(esperado);

      const antigo = { titulo: 'teste', cor: 'teste' };
      const novo = new Categoria({ ...antigo, titulo: 'testeAtualizado' });
      const response = await novo.atualizar(2);

      expect(response).toEqual(expect.objectContaining(esperado));
      expect(QueryPromise.selectFromId).toHaveBeenCalledTimes(1);
      expect(QueryPromise.selectFromId).toHaveBeenCalledWith(2, 'categoria');

      jest.restoreAllMocks();
    });

    describe('ERROS in atualizar Categorias', () => {
      it('Deve dar erro com query errada ao atualizar', async () => {
        jest.spyOn(QueryPromise, 'selectFromId').mockImplementation(() => {
          throw new NotFoundError();
        });

        const novo = new Categoria({ titulo: 'testeAtualizado' });

        await expect(novo.atualizar(2)).rejects.toThrow(NotFoundError);

        jest.restoreAllMocks(); // Garante que os mocks são restaurados
      });
    });
  });

  describe('Categorias metodo deletar', () => {
    it('Deve deletar categoria', async () => {
      jest.spyOn(QueryPromise, 'deleteFromId').mockReturnValue({ message: 'deleted successfully' });
      const response = await Categoria.deletar(1);

      expect(response).toEqual({ message: 'deleted successfully' });
      expect(QueryPromise.deleteFromId).toHaveBeenCalledTimes(1);
      expect(QueryPromise.deleteFromId).toHaveBeenCalledWith(1, 'categoria');
    });

    describe('ERROS in deletar Categorias', () => {
      it('Deve dar erro ao tentar deletar uma categoria sendo usada em um video', async () => {
        jest.spyOn(QueryPromise, 'deleteFromId').mockImplementation(() => { throw new Error('ER_ROW_IS_REFERENCED_2'); });

        await expect(Categoria.deletar(1)).rejects.toThrow(BadRequestError);
      });
    });
  });
});
