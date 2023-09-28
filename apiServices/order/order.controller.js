import {
  getOrderById,
  getOrders,
  newOrder,
} from './order.model.js';
import CustomError from '../../utils/customError.js';
import OrderAcceptedEmail from '../../services/email/OrderAcceptedEmail.js';
import consts from '../../utils/consts.js';
import { isMemberController } from '../organization/organization.controller.js';

const newOrderController = async (req, res) => {
  const { idOrderRequest } = req.body;

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

const getOrdersController = async (req, res) => {
  const {
    page, search, startDeadline, endDeadline, idProduct,
  } = req.query;
  try {
    const result = await getOrders({
      idProduct, startDeadline, endDeadline, page, search,
    });
    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener las ordenes aprobadas.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getOrderByIdController = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.session.role === consts.role.client ? req.session.userId : undefined;
  try {
    const result = await getOrderById(orderId);
    if (userId) {
      const idClient = result.clientOrganization;
      await isMemberController({ userId, idClient });
    }

    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener la información de este pedido.';
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
  newOrderController,
  getOrdersController,
  getOrderByIdController,
};
