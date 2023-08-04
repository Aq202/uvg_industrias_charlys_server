import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newColorSchema from '../../utils/validationSchemas/newColorSchema.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import { getColorsController, newColorController } from './color.controller.js';

const colorRouter = express.Router();

colorRouter.post('/', ensureAdminAuth, validateBody(newColorSchema), newColorController);
colorRouter.get('/', ensureAdminAuth, getColorsController);

export default colorRouter;
