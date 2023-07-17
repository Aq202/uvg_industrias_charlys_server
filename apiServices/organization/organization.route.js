import express from 'express';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import {
  getClientsController,
  newOrganizationController,
  updateOrganizationController,
  deleteOrganizationController,
  getOrganizationsController,
} from './organization.controller.js';
import validateBody from '../../middlewares/validateBody.js';
import newOrganizationSchema from '../../utils/validationSchemas/newOrganizationSchema.js';
import updateOrganizationSchema from '../../utils/validationSchemas/updateOrganizationSchema.js';

const organizationRouter = express.Router();

organizationRouter.get('/clients/:idOrganization', ensureAdminAuth, getClientsController);
organizationRouter.get('/', ensureAdminAuth, getOrganizationsController);
organizationRouter.post('/newOrganization', ensureAdminAuth, validateBody(newOrganizationSchema), newOrganizationController);
organizationRouter.put('/updateOrganization', ensureAdminAuth, validateBody(updateOrganizationSchema), updateOrganizationController);
organizationRouter.delete('/deleteOrganization', ensureAdminAuth, deleteOrganizationController);

export default organizationRouter;
