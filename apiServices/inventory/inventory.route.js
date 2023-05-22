import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newInventoryElementSchema from '../../utils/validationSchemas/newInventoryElementSchema.js';
import { getInventoryController, newInventoryElementController } from './inventory.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';

const inventoryRouter = express.Router();

inventoryRouter.post('/', validateBody(newInventoryElementSchema), newInventoryElementController);
inventoryRouter.get('/', ensureAdminAuth, getInventoryController);

export default inventoryRouter;
