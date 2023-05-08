import express from 'express';
import generalRouter from '../apiServices/general/general.route.js';
import userRouter from '../apiServices/user/user.route.js';

const router = express.Router();

router.use('/', generalRouter);

const apiPath = '/api';

router.use(`${apiPath}/user`, userRouter);

export default router;
