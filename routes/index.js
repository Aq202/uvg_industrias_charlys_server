import express from 'express';
import userRouter from '../apiServices/user/user.route.js';
import sessionRouter from '../apiServices/session/session.route.js';
import orderRequestRouter from '../apiServices/orderRequest/orderRequest.route.js';

const router = express.Router();

const apiPath = '/api';

router.use(`${apiPath}/user`, userRouter);
router.use(`${apiPath}/session`, sessionRouter);
router.use(`${apiPath}/orderRequest`, orderRequestRouter);

router.get('*', (req, res) => {
  res.sendFile(`${global.dirname}/public/index.html`);
});

export default router;
