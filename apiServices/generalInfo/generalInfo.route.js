import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newSizeSchema from '../../utils/validationSchemas/newSizeSchema.js';
import { newSizeController, getSizesController } from './generalInfo.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';

const generalInfoRouter = express.Router();

generalInfoRouter.post('/size', validateBody(newSizeSchema), newSizeController);
generalInfoRouter.get('/size', ensureAdminAuth, getSizesController);

export default generalInfoRouter;
