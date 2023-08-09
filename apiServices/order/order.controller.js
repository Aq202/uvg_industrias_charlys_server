import { newOrder } from './order.model.js';
import CustomError from '../../utils/customError.js';
import OrderAcceptedEmail from '../../services/email/OrderAcceptedEmail.js';

const newOrderController = async (req, res) => {
  const { idOrderRequest } = req.params;

  try {
    const {
      id, users, detail, total,
    } = await newOrder({ idOrderRequest });

    const emailPromises = users.map(async (user) => {
      const emailSender = new OrderAcceptedEmail({
        addresseeEmail: user.email, name: user.name, idOrderRequest, idOrder: id, detail, total,
      });
      await emailSender.sendEmail();
    });

    await Promise.all(emailPromises);

    res.send({ id });
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
