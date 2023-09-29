import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newOrderRequestSchema from './validationSchemas/newOrderRequestSchema.js';
import {
  confirmTemporaryClientController,
  getOrderRequestByIdController,
  getOrderRequestsController,
  newLoggedOrderRequestController,
  newOrderRequestController,
  updateOrderRequestController,
} from './orderRequest.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import multerMiddleware from '../../middlewares/multerMiddleware.js';
import uploadImage from '../../services/uploadFiles/uploadImage.js';
import newClientOrderRequestSchema from './validationSchemas/newClientOrderRequestSchema.js';
import ensureAdminOrClientAuth from '../../middlewares/ensureAdminOrClientAuth.js';
import updateOrderRequestSchema from './validationSchemas/updateOrderRequestSchema.js';
import parseObjectBodyProp from '../../middlewares/parseObjectBodyProp.js';
import confirmTemporaryClientSchema from './validationSchemas/confirmTemporaryClientSchema.js';
import consts from '../../utils/consts.js';
import newClientOrderRequestByAdminSchema from './validationSchemas/newClientOrderRequestByAdminSchema.js';

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
  parseObjectBodyProp('products'),
  validateBody(newClientOrderRequestSchema, consts.role.client),
  validateBody(newClientOrderRequestByAdminSchema, consts.role.admin),
  newLoggedOrderRequestController,
);
orderRequestRouter.get('/', ensureAdminAuth, getOrderRequestsController);
orderRequestRouter.get('/:orderRequestId', ensureAdminAuth, getOrderRequestByIdController);

orderRequestRouter.patch('/:orderRequestId/temporaryClient/confirm', ensureAdminAuth, validateBody(confirmTemporaryClientSchema), confirmTemporaryClientController);

export default orderRequestRouter;
