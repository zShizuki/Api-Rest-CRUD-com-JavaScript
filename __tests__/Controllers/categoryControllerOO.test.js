/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import CategoryController from '../../Controllers/categoryController.js';
import Categoria from '../../classes/models/categoria.js';
import QueryPromise from '../../utils/queryPromise.js';

describe('Testes com Category Controller', () => {
  const objetoInstanciar = {
    titulo: 'Jest',
    cor: 'red',
  };

  describe('Testes com Category Controller', () => {
    describe('Testes com Category Controller', () => {
      it('Deve salvar no BD com await (testando o método real, mas mockando o banco)', async () => {
        const mockID = 123;

        // 🔹 Mockando a inserção no banco para retornar um insertId válido
        jest.spyOn(QueryPromise, 'constructPromise').mockResolvedValue({ insertId: mockID });

        // 🔹 Mockando a busca pelo ID para simular um retorno correto
        jest.spyOn(QueryPromise, 'selectFromId').mockResolvedValue([{ ID: mockID, ...objetoInstanciar }]);

        // Criamos a instância normalmente
        const editora = new Categoria(objetoInstanciar);
        const dados = await editora.criar(); // Vai usar o método real, mas sem acessar o BD

        expect(dados).toEqual(
          expect.objectContaining({
            ...objetoInstanciar,
            ID: expect.any(Number),
          }),
        );

        // Restaurar os mocks depois do teste
        jest.restoreAllMocks();
      });
    });
  });

  it.skip('Deve retornar erro ao tentar deletar id 1', async () => {
    await expect(Categoria.deletar(1)).rejects.toThrow('Cant delete id number 1');
  });
});
