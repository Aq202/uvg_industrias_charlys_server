import { describe, it } from 'node:test';
import { createAdmin } from './user.model.js';
import randomString from '../../utils/randomString.js';

describe('Api service: user', () => {
  describe('Create admin user', async () => {
    const name = 'Usuario testing';
    const lastName = 'Usuario testing';
    const email = `${randomString(10)}@gmail.com`;
    const phone = '54685487';
    const sex = 'M';
    const passwordHash = 'asdfasfd';

    it('Name required', async () => {
      try {
        await createAdmin({
          name: null, lastName, email, phone, sex, passwordHash,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de name no puede ser null.');
    });

    it('lastName required', async () => {
      try {
        await createAdmin({
          name, lastName: null, email, phone, sex, passwordHash,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de lastName no puede ser null.');
    });

    it('email required', async () => {
      try {
        await createAdmin({
          name, lastName, email: null, phone, sex, passwordHash,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de name no puede ser null.');
    });

    it('Sex required', async () => {
      try {
        await createAdmin({
          name, lastName, email, phone, sex: null, passwordHash,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de sex no puede ser null.');
    });

    it('Sex not valid value', async () => {
      try {
        await createAdmin({
          name, lastName, email, phone, sex: 'J', passwordHash,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de sex no puede ser arbitrario.');
    });

    it('Valid email', async () => {
      try {
        await createAdmin({
          name, lastName, email: 'asfd', phone, sex, passwordHash,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de email debe ser un email válido.');
    });

    it('M user created', async () => {
      await createAdmin({
        name, lastName, email, phone, sex: 'M', passwordHash,
      });
    });

    it('Unique user email', async () => {
      try {
        await createAdmin({
          name, lastName, email, phone, sex, passwordHash,
        });
      } catch (ex) {
        // Fallo esperado
        return;
      }
      throw new Error('El valor de email debe ser único.');
    });

    it('F user created', async () => {
      await createAdmin({
        name, lastName, email: `${randomString(10)}@gmail.com`, phone, sex: 'F', passwordHash,
      });
    });
  });
});
