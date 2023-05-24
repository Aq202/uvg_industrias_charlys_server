import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newInventoryElementSchema from '../../utils/validationSchemas/newInventoryElementSchema.js';
import {
  getInventoryController,
  newInventoryElementController,
  getInventorybyIdController,
  updateInventoryElementController,
} from './inventory.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';

const inventoryRouter = express.Router();

inventoryRouter.post('/', validateBody(newInventoryElementSchema), newInventoryElementController);
inventoryRouter.get('/', ensureAdminAuth, getInventoryController);
inventoryRouter.get('/id', ensureAdminAuth, getInventorybyIdController);
inventoryRouter.put('/update', ensureAdminAuth, updateInventoryElementController);

export default inventoryRouter;
