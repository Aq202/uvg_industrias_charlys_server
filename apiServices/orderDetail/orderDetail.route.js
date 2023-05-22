import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newOrderDetailSchema from '../../utils/validationSchemas/newOrderDetailSchema.js';
import { getOrderDetailsController, newOrderDetailController } from './orderDetail.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';

const orderDetailRouter = express.Router();

orderDetailRouter.post('/', validateBody(newOrderDetailSchema), newOrderDetailController);
orderDetailRouter.get('/', ensureAdminAuth, getOrderDetailsController);

export default orderDetailRouter;
