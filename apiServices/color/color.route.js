import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import newColorSchema from './validationSchema/newColorSchema.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import { getColorsByOrganizationController, getColorsController, newColorController } from './color.controller.js';
import ensureAdminOrClientAuth from '../../middlewares/ensureAdminOrClientAuth.js';

const colorRouter = express.Router();

colorRouter.post('/', ensureAdminAuth, validateBody(newColorSchema), newColorController);
colorRouter.get('/', ensureAdminAuth, getColorsController);
colorRouter.get('/organization/:idOrganization', ensureAdminOrClientAuth, getColorsByOrganizationController);

export default colorRouter;
