import sha256 from 'js-sha256';
import CustomError from '../../utils/customError.js';
import { createAdmin } from './user.model.js';

const createAdminController = async (req, res) => {
  const {
    name, lastName, email, phone, sex, password,
  } = req.body;

  try {
    const passwordHash = sha256(password);
    const userId = await createAdmin({
      name, lastName, email, phone, sex, passwordHash,
    });

    res.status(200).send({ id: userId });
  } catch (ex) {
    let err = 'Ocurrio un error al crear usuario admin';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
  return null;
};

export {
  // eslint-disable-next-line import/prefer-default-export
  createAdminController,
};
