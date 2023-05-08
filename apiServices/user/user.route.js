import express from 'express';

import validateBody from '../../middlewares/validateBody.js';
import registerUserSchema from '../../utils/validationSchemas/registerUserSchema.js';
import { createAdminController } from './user.controller.js';

const userRouter = express.Router();

userRouter.post('/admin', validateBody(registerUserSchema), createAdminController);

export default userRouter;
