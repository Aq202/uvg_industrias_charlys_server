import express from 'express';
import validateBody from '../../middlewares/validateBody.js';
import loginSchema from '../../utils/validationSchemas/loginSchema.js';
import { loginController, refreshAccessTokenController } from './session.controller.js';
import ensureRefreshTokenAuth from '../../middlewares/ensureRefreshTokenAuth.js';

const sessionRouter = express.Router();

sessionRouter.post('/login', validateBody(loginSchema), loginController);
sessionRouter.get('/accessToken', ensureRefreshTokenAuth, refreshAccessTokenController);

export default sessionRouter;
