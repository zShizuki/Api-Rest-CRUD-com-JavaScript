/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import CategoryController from '../../Controllers/categoryControllerOO.js';
import Categoria from '../../models/categoria.js';

describe('Testes com Category Controller', () => {
  const objetoInstanciar = {
    titulo: 'Jest',
    cor: 'red',
  };

  it('Deve salvar no BD com await', async () => {
    const editora = new Categoria(objetoInstanciar);

    const dados = await editora.criar();
    console.log(dados);
    const retorna = await Categoria.pegarPeloId(dados.ID);

    expect(retorna).toEqual(
      expect.objectContaining({
        ...objetoInstanciar,
        ID: expect.any(Number),
      }),
    );
  });
});
