import { newOrder } from './order.model.js';
import CustomError from '../../utils/customError.js';

const newOrderController = async (req, res) => {
  const { idOrderRequest } = req.params;

  try {
    const result = await newOrder({ idOrderRequest });

    // const emailSender = new NewUserEmail({ addresseeEmail: email, name, registerToken: token });
    // await emailSender.sendEmail();

    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al generar el pedido.';
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
  // eslint-disable-next-line import/prefer-default-export
  newOrderController,
};
