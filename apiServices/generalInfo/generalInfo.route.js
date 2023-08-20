import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newSizeSchema from '../../utils/validationSchemas/newSizeSchema.js';
import newFabricSchema from '../../utils/validationSchemas/newFabricSchema.js';
import {
  newSizeController,
  getSizesController,
  getMaterialsController,
  newFabricController,
  getFabricsController,
} from './generalInfo.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import ensureAdminOrClientAuth from '../../middlewares/ensureAdminOrClientAuth.js';

const generalInfoRouter = express.Router();

generalInfoRouter.post('/size', validateBody(newSizeSchema), newSizeController);
generalInfoRouter.get('/size', ensureAdminOrClientAuth, getSizesController);
generalInfoRouter.get('/material', ensureAdminAuth, getMaterialsController);
generalInfoRouter.post('/fabric', validateBody(newFabricSchema), newFabricController);
generalInfoRouter.get('/fabric', ensureAdminAuth, getFabricsController);

export default generalInfoRouter;
