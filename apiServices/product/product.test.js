import { describe, it } from 'node:test';

const wait = async () => new Promise((resolve) => {
  const time = Math.random() * 1000 + 500;
  setTimeout(() => resolve(), time);
});
describe('Api service: product', () => {
  describe('Create new product model: ', async () => {
    it('El campo name es obligatorio.', async () => {
      await wait();
    });
    it('El campo color es obligatorio.', async () => {
      await wait();
    });
    it('La organización es obligatoria.', async () => {
      await wait();
    });
    it('Crear producto de modelo correctamente..', async () => {
      await wait();
    });
  });

  describe('Obtener modelo de producto por id: ', async () => {
    it('Obtener producto no existente.', async () => {
      await wait();
    });
    it('Obtener producto existente.', async () => {
      await wait();
    });
  });

  describe('Update product model', async () => {
    it('Actualizar datos de modelo de producto.', async () => {
      await wait();
    });
    it('Verificar si los cambios fueron realizados.', async () => {
      await wait();
    });
  });
});
