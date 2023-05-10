import express from 'express';
import generalRouter from '../apiServices/general/general.route.js';
import userRouter from '../apiServices/user/user.route.js';
import sessionRouter from '../apiServices/session/session.route.js';
import orderRequestRouter from '../apiServices/orderRequest/orderRequest.route.js';

const router = express.Router();

router.use('/', generalRouter);

const apiPath = '/api';

router.use(`${apiPath}/user`, userRouter);
router.use(`${apiPath}/session`, sessionRouter);
router.use(`${apiPath}/orderRequest`, orderRequestRouter);

export default router;
