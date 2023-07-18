import express from 'express';

import validateBody from '../../middlewares/validateBody.js';
import registerUserSchema from './validationSchemas/registerAdminUserSchema.js';
import { createAdminController, createOrganizationMemberController } from './user.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import registerClientUserSchema from './validationSchemas/registerClientUserSchema.js';

const userRouter = express.Router();

userRouter.post('/admin', ensureAdminAuth, validateBody(registerUserSchema), createAdminController);
userRouter.post('/client', ensureAdminAuth, validateBody(registerClientUserSchema), createOrganizationMemberController);

export default userRouter;
