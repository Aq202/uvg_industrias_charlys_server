import express from 'express';

import validateBody from '../../middlewares/validateBody.js';
import registerUserSchema from './validationSchemas/registerAdminUserSchema.js';
import {
  createAdminController,
  createOrganizationMemberController,
  finishRegistrationController,
  validateRegisterTokenController,
} from './user.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import registerClientUserSchema from './validationSchemas/registerClientUserSchema.js';
import finishRegistrationSchema from './validationSchemas/finishRegistrationSchema.js';
import ensureRegisterAuth from '../../middlewares/ensureRegisterAuth.js';

const userRouter = express.Router();

userRouter.post('/admin', ensureAdminAuth, validateBody(registerUserSchema), createAdminController);
userRouter.post(
  '/client',
  ensureAdminAuth,
  validateBody(registerClientUserSchema),
  createOrganizationMemberController,
);
userRouter.post(
  '/finishRegistration',
  ensureRegisterAuth,
  validateBody(finishRegistrationSchema),
  finishRegistrationController,
);
userRouter.get('/validateRegisterToken', ensureRegisterAuth, validateRegisterTokenController);
export default userRouter;
