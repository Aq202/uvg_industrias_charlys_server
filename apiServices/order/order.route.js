import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newOrderSchema from './validationSchemas/newOrderSchema.js';
import updatePhaseSchema from './validationSchemas/updatePhaseSchema.js';
import {
  getOrderByIdController,
  getOrdersController,
  newOrderController,
  updateOrderPhaseController,
} from './order.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import ensureAdminOrClientAuth from '../../middlewares/ensureAdminOrClientAuth.js';

const orderRouter = express.Router();

orderRouter.post(
  '/',
  ensureAdminAuth,
  validateBody(newOrderSchema),
  newOrderController,
);

orderRouter.get(
  '/',
  ensureAdminAuth,
  getOrdersController,
);

orderRouter.get(
  '/:orderId?',
  ensureAdminOrClientAuth,
  getOrderByIdController,
);

orderRouter.put(
  '/phase',
  ensureAdminAuth,
  validateBody(updatePhaseSchema),
  updateOrderPhaseController,
);

export default orderRouter;
