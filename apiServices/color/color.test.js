import { describe, it } from 'node:test';
import randomString from '../../utils/randomString.js';
import { newColor } from './color.model.js';

describe('Api service: color', () => {
  const name = `prueba-${randomString(10)}`;
  const red = 255;
  const green = 255;
  const blue = 255;
  describe('Create color', async () => {
    it('Name required', async () => {
      try {
        await newColor({
          name: null, red, green, blue,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de name no puede ser null.');
    });

    it('Red required', async () => {
      try {
        await newColor({
          name, red: null, green, blue,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de red no puede ser null.');
    });
    it('Green required', async () => {
      try {
        await newColor({
          name, red, green: null, blue,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de green no puede ser null.');
    });
    it('Blue required', async () => {
      try {
        await newColor({
          name, red, green, blue: null,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de blue no puede ser null.');
    });

    it('Red invalid number value', async () => {
      try {
        await newColor({
          name, red: -1, green, blue,
        });
      } catch (ex) {
        // probar limite superior
        try {
          await newColor({
            name, red: 256, green, blue,
          });
        } catch (err) {
          // Fallo esperado
          return;
        }
      }
      throw new Error('El valor de red debe estar entre 0 y 255.');
    });

    it('Green invalid number value', async () => {
      try {
        await newColor({
          name, red, green: -1, blue,
        });
      } catch (ex) {
        // probar limite superior
        try {
          await newColor({
            name, red, green: 256, blue,
          });
        } catch (err) {
          // Fallo esperado
          return;
        }
      }
      throw new Error('El valor de green debe estar entre 0 y 255.');
    });

    it('Blue invalid number value', async () => {
      try {
        await newColor({
          name, red, green, blue: -1,
        });
      } catch (ex) {
        // probar limite superior
        try {
          await newColor({
            name, red, green, blue: 256,
          });
        } catch (err) {
          // Fallo esperado
          return;
        }
      }
      throw new Error('El valor de blue debe estar entre 0 y 255.');
    });

    it('Create new color', async () => {
      await newColor({
        name, red, green, blue,
      });
    });

    it('No duplicated color names', async () => {
      try {
        await newColor({
          name, red, green, blue,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de name debe ser único.');
    });
  });
});
