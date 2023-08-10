import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newOrderSchema from './validationSchemas/newOrderSchema.js';
import { newOrderController } from './order.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';

const orderRouter = express.Router();

orderRouter.post(
  '/',
  ensureAdminAuth,
  validateBody(newOrderSchema),
  newOrderController,
);

export default orderRouter;
