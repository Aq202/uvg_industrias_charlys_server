import express from 'express';
import { getClientsController } from './organization.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';

const organizationRouter = express.Router();

organizationRouter.get('/clients/:idOrganization', ensureAdminAuth, getClientsController);

export default organizationRouter;
