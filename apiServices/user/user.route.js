import express from 'express';

import validateBody from '../../middlewares/validateBody.js';
import registerUserSchema from './validationSchemas/registerAdminUserSchema.js';
import recoverPasswordSchema from './validationSchemas/recoverPasswordSchema.js';
import {
  createAdminController,
  createOrganizationMemberController,
  finishRegistrationController,
  recoverPasswordController,
  removeOrganizationMemberController,
  updateUserPasswordController,
  validateRecoverTokenController,
  validateRegisterTokenController,
} from './user.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import registerClientUserSchema from './validationSchemas/registerClientUserSchema.js';
import finishRegistrationSchema from './validationSchemas/finishRegistrationSchema.js';
import ensureRegisterAuth from '../../middlewares/ensureRegisterAuth.js';
import ensureRecoverAuth from '../../middlewares/ensureRecoverAuth.js';
// import ensureRecoverAuth from '../../middlewares/ensureRecoverAuth.js';

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
userRouter.delete('/client/:idUser', ensureAdminAuth, removeOrganizationMemberController);

userRouter.post('/recoverPassword', validateBody(recoverPasswordSchema), recoverPasswordController);

userRouter.post(
  '/updatePassword',
  ensureRecoverAuth,
  validateBody(finishRegistrationSchema),
  updateUserPasswordController,
);

userRouter.get('/validateRecoverToken', ensureRecoverAuth, validateRecoverTokenController);

export default userRouter;
