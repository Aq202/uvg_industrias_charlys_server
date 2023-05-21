import CustomError from '../../utils/customError.js';
import { getSizes, newSize } from './generalInfo.model.js';

const newSizeController = async (req, res) => {
  const { size } = req.body;

  try {
    const { id } = await newSize({ size });
    res.send({ id });
  } catch (ex) {
    let err = 'Ocurrio un error al crear la talla.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getSizesController = async (req, res) => {
  try {
    const result = await getSizes();

    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener las tallas disponibles.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

export { newSizeController, getSizesController };
