import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newOrderRequestSchema from '../../utils/validationSchemas/newOrderRequestSchema.js';
import { getOrderRequestByIdController, getOrderRequestsController, newOrderRequestController } from './orderRequest.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import multerMiddleware from '../../middlewares/multerMiddleware.js';
import uploadImage from '../../services/uploadFiles/uploadImage.js';

const orderRequestRouter = express.Router();

orderRequestRouter.post('/', multerMiddleware(uploadImage.any()), validateBody(newOrderRequestSchema), newOrderRequestController);
orderRequestRouter.get('/', ensureAdminAuth, getOrderRequestsController);
orderRequestRouter.get('/:orderRequestId', ensureAdminAuth, getOrderRequestByIdController);

export default orderRequestRouter;
