import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import {
  getInventoryController,
  getInventorybyIdController,
  updateInventoryElementController,
  newMaterialTypeController,
  getMaterialsTypeController,
  newMaterialController,
} from './inventory.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import newMaterialTypeSchema from '../../utils/validationSchemas/newMaterialTypeSchema.js';
import newMaterialSchema from '../../utils/validationSchemas/newMaterialSchema.js';

const inventoryRouter = express.Router();

inventoryRouter.post('/material', validateBody(newMaterialSchema), newMaterialController);
inventoryRouter.get('/', ensureAdminAuth, getInventoryController);
inventoryRouter.get('/id', ensureAdminAuth, getInventorybyIdController);
inventoryRouter.put('/update', ensureAdminAuth, updateInventoryElementController);
inventoryRouter.post('/materialType', ensureAdminAuth, validateBody(newMaterialTypeSchema), newMaterialTypeController);
inventoryRouter.get('/materialType', ensureAdminAuth, getMaterialsTypeController);
export default inventoryRouter;
