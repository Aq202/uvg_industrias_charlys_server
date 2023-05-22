import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newProductTypeSchema from '../../utils/validationSchemas/newProductTypeSchema.js';
import newProductRequirementSchema from '../../utils/validationSchemas/newProductRequirementSchema.js';
import newProductSchema from '../../utils/validationSchemas/newProductSchema.js';
import {
  getProductRequirementsController,
  getProductsController,
  getProuctTypesController,
  newProductController,
  newProductRequirementController,
  newProuctTypeController,
} from './product.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';

const productRouter = express.Router();

productRouter.post('/type', validateBody(newProductTypeSchema), newProuctTypeController);
productRouter.get('/type', ensureAdminAuth, getProuctTypesController);
productRouter.post('/requirement', validateBody(newProductRequirementSchema), newProductRequirementController);
productRouter.get('/requirement', ensureAdminAuth, getProductRequirementsController);
productRouter.post('/', validateBody(newProductSchema), newProductController);
productRouter.get('/', ensureAdminAuth, getProductsController);

export default productRouter;
