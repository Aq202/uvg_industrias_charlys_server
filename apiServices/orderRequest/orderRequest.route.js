import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newOrderRequestSchema from '../../utils/validationSchemas/newOrderRequestSchema.js';
import { newOrderRequestController } from './orderRequest.controller.js';

const orderRequestRouter = express.Router();

orderRequestRouter.post('/', validateBody(newOrderRequestSchema), newOrderRequestController);

export default orderRequestRouter;
