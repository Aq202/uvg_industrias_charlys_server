import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import {
  getInventoryController,
  getInventorybyIdController,
  newMaterialTypeController,
  getMaterialsTypeController,
  newMaterialController,
  updateMaterialController,
} from './inventory.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import newMaterialTypeSchema from '../../utils/validationSchemas/newMaterialTypeSchema.js';
import newMaterialSchema from '../../utils/validationSchemas/newMaterialSchema.js';
import updateMaterialSchema from '../../utils/validationSchemas/updateMaterialSchema.js';

const inventoryRouter = express.Router();

inventoryRouter.post('/material', validateBody(newMaterialSchema), newMaterialController);
inventoryRouter.get('/', ensureAdminAuth, getInventoryController);
inventoryRouter.get('/id', ensureAdminAuth, getInventorybyIdController);
inventoryRouter.put('/updateMaterial', ensureAdminAuth, validateBody(updateMaterialSchema), updateMaterialController);
inventoryRouter.post('/materialType', ensureAdminAuth, validateBody(newMaterialTypeSchema), newMaterialTypeController);
inventoryRouter.get('/materialType', ensureAdminAuth, getMaterialsTypeController);
export default inventoryRouter;
