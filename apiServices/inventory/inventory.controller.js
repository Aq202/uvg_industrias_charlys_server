import CustomError from '../../utils/customError.js';
import {
  getInventory, getInventorybyId, newInventoryElement, updateInventoryElement,
} from './inventory.model.js';

const newInventoryElementController = async (req, res) => {
  const {
    material, fabric, product, size, quantity, measurementUnit, supplier, details,
  } = req.body;

  try {
    const { id } = await newInventoryElement({
      material, fabric, product, size, quantity, measurementUnit, supplier, details,
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
    console.log(ex);
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

const getInventorybyIdController = async (req, res) => {
  const { search } = req.query;

  try {
    const result = await getInventorybyId(search);
    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener la información del inventario.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const updateInventoryElementController = async (req, res) => {
  const {
    material,
    fabric,
    product,
    description,
    color,
    quantity,
    supplier,
    details,
  } = req.body;

  try {
    const { id } = await updateInventoryElement({
      material,
      fabric,
      product,
      description,
      color,
      quantity,
      supplier,
      details,
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

const deleteInventoryElementController = async (req, res) => {
  const {
    materialId,
    productId,
  } = req.body;

  try {
    const { id } = await updateInventoryElement({
      materialId,
      productId,
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

export {
  newInventoryElementController,
  getInventoryController,
  getInventorybyIdController,
  updateInventoryElementController,
  deleteInventoryElementController,
};
