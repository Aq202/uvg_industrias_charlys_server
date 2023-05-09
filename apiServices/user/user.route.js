import express from 'express';

import validateBody from '../../middlewares/validateBody.js';
import registerUserSchema from '../../utils/validationSchemas/registerUserSchema.js';
import { createAdminController } from './user.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';

const userRouter = express.Router();

userRouter.post('/admin', ensureAdminAuth, validateBody(registerUserSchema), createAdminController);

export default userRouter;
