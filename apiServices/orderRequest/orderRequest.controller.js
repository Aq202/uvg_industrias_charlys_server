import CustomError from '../../utils/customError.js';
import { newOrderRequest } from './orderRequest.model.js';

const newOrderRequestController = async (req, res) => {
  const {
    name, email, phone, address, description,
  } = req.body;

  try {
    const { id } = await newOrderRequest({
      name, email, phone, address, description,
    });
    res.send({ id });
  } catch (ex) {
    let err = 'Ocurrio un error al registrar intención de compra.';
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
export { newOrderRequestController };
