import CustomError from '../../utils/customError.js';
import { getInventory, newInventoryElement } from './inventory.model.js';

const newInventoryElementController = async (req, res) => {
  const {
    material, fabric, product, size, quantity,
  } = req.body;

  try {
    const { id } = await newInventoryElement({
      material, fabric, product, size, quantity,
    });
    res.send({ id });
  } catch (ex) {
    let err = 'La información ingresada no es válida.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getInventoryController = async (req, res) => {
  const { search } = req.query;

  try {
    const result = await getInventory(search);
    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener registros del inventario.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

export { newInventoryElementController, getInventoryController };
