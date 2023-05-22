import CustomError from '../../utils/customError.js';
import {
  getProductTypes,
  getProducts,
  getRequirements,
  newProduct,
  newProductType,
  newRequeriment,
} from './product.model.js';

const newProuctTypeController = async (req, res) => {
  const { name } = req.body;

  try {
    const { id } = await newProductType({ name });
    res.send({ id });
  } catch (ex) {
    let err = 'Ocurrio un error al registrar el tipo de producto.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getProuctTypesController = async (req, res) => {
  try {
    const result = await getProductTypes();

    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener los tipos de producto disponibles.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const newProductController = async (req, res) => {
  const { type, client, color } = req.body;

  try {
    const { id } = await newProduct({ type, client, color });
    res.send({ id });
  } catch (ex) {
    let err = 'Ocurrio un error al registrar el nuevo producto.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getProductsController = async (req, res) => {
  const { search } = req.query;

  try {
    const result = await getProducts(search);

    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener los productos disponibles.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const newProductRequirementController = async (req, res) => {
  const {
    product, size, material, fabric, quantityPerUnit,
  } = req.body;

  try {
    const { id } = await newRequeriment({
      product, size, material, fabric, quantityPerUnit,
    });
    res.send({ id });
  } catch (ex) {
    let err = `Ocurrio un error al registrar el nuevo requerimiento para el producto ${product}.`;
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getProductRequirementsController = async (req, res) => {
  const { product, search } = req.query;

  try {
    const result = await getRequirements(product, search);

    res.send(result);
  } catch (ex) {
    let err = `Ocurrio un error al obtener los requerimientos del producto ${product}.`;
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
  newProuctTypeController,
  getProuctTypesController,
  newProductController,
  getProductsController,
  newProductRequirementController,
  getProductRequirementsController,
};
