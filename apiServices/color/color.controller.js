import CustomError from '../../utils/customError.js';
import { getColors, getColorsByOrganization, newColor } from './color.model.js';

const newColorController = async (req, res) => {
  const {
    name, red, green, blue,
  } = req.body;

  try {
    const { id } = await newColor({
      name, red, green, blue,
    });
    res.send({ id });
  } catch (ex) {
    let err = 'Ocurrio un error al registrar el color.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getColorsController = async (req, res) => {
  const { search } = req.query;
  try {
    const result = await getColors({ search });

    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener los colores disponibles.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getColorsByOrganizationController = async (req, res) => {
  const { idOrganization } = req.params;
  const { search } = req.query;
  try {
    const result = await getColorsByOrganization({ idOrganization, search });

    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener los colores utilizados por una organización.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

export {
  newColorController,
  getColorsController,
  getColorsByOrganizationController,
};
