import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newOrderRequestSchema from './validationSchemas/newOrderRequestSchema.js';
import {
  getOrderRequestByIdController,
  getOrderRequestsController,
  newClientOrderRequestController,
  newOrderRequestController,
  updateOrderRequestController,
} from './orderRequest.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import multerMiddleware from '../../middlewares/multerMiddleware.js';
import uploadImage from '../../services/uploadFiles/uploadImage.js';
import newClientOrderRequestSchema from './validationSchemas/newClientOrderRequestSchema.js';
import ensureAdminOrClientAuth from '../../middlewares/ensureAdminOrClientAuth.js';
import updateOrderRequestSchema from './validationSchemas/updateOrderRequestSchema.js';

const orderRequestRouter = express.Router();

orderRequestRouter.post(
  '/',
  multerMiddleware(uploadImage.any()),
  validateBody(newOrderRequestSchema),
  newOrderRequestController,
);

orderRequestRouter.put(
  '/',
  ensureAdminAuth,
  multerMiddleware(uploadImage.any()),
  validateBody(updateOrderRequestSchema),
  updateOrderRequestController,
);

orderRequestRouter.post(
  '/client',
  ensureAdminOrClientAuth,
  multerMiddleware(uploadImage.any()),
  validateBody(newClientOrderRequestSchema),
  newClientOrderRequestController,
);
orderRequestRouter.get('/', ensureAdminAuth, getOrderRequestsController);
orderRequestRouter.get('/:orderRequestId', ensureAdminAuth, getOrderRequestByIdController);

export default orderRequestRouter;
