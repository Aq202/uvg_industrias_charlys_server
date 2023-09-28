import CustomError from '../../utils/customError.js';
import {
  newOrderDetail,
  updateProductProgress,
} from './orderDetail.model.js';

const newOrderDetailController = async (req, res) => {
  const {
    noOrder, product, size, quantity,
  } = req.body;

  try {
    const { id } = await newOrderDetail({
      noOrder, product, size, quantity,
    });
    res.send({ id });
  } catch (ex) {
    let err = `Ocurrio un error al agregar el elemento a la orden ${noOrder}.`;
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const updateProductProgressController = async (req, res) => {
  const {
    completed, idOrder, idProduct, size,
  } = req.body;
  try {
    await updateProductProgress({
      completed, idOrder, idProduct, size,
    });
    res.send({ id: idOrder });
  } catch (ex) {
    let err = 'Ocurrio un error al actualizar la cantidad de unidades completadas.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

// eslint-disable-next-line import/prefer-default-export
export {
  newOrderDetailController,
  updateProductProgressController,
};
