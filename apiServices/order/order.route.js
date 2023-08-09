import express from 'express';
import { newOrderController } from './order.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';

const orderRouter = express.Router();

orderRouter.post(
  '/:idOrderRequest',
  ensureAdminAuth,
  newOrderController,
);

export default orderRouter;
