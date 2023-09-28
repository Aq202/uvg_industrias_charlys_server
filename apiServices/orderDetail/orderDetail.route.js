import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newOrderDetailSchema from '../../utils/validationSchemas/newOrderDetailSchema.js';
import {
  getOrderDetailsController,
  newOrderDetailController,
  updateProductProgressController,
} from './orderDetail.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import updateProductProgressSchema from './validationSchemas/updateProductProgressSchema.js';

const orderDetailRouter = express.Router();

orderDetailRouter.post('/', validateBody(newOrderDetailSchema), newOrderDetailController);
orderDetailRouter.get('/', ensureAdminAuth, getOrderDetailsController);
orderDetailRouter.put(
  '/',
  ensureAdminAuth,
  validateBody(updateProductProgressSchema),
  updateProductProgressController,
);

export default orderDetailRouter;
