import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newOrderRequestSchema from '../../utils/validationSchemas/newOrderRequestSchema.js';
import { getOrderRequestsController, newOrderRequestController } from './orderRequest.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';

const orderRequestRouter = express.Router();

orderRequestRouter.post('/', validateBody(newOrderRequestSchema), newOrderRequestController);
orderRequestRouter.get('/', ensureAdminAuth, getOrderRequestsController);

export default orderRequestRouter;
