import express from 'express';
import userRouter from '../apiServices/user/user.route.js';
import sessionRouter from '../apiServices/session/session.route.js';
import orderRequestRouter from '../apiServices/orderRequest/orderRequest.route.js';
import generalInfoRouter from '../apiServices/generalInfo/generalInfo.route.js';
import inventoryRouter from '../apiServices/inventory/inventory.route.js';
import orderDetailRouter from '../apiServices/orderDetail/orderDetail.route.js';
import productRouter from '../apiServices/product/product.route.js';
import imageRouter from '../apiServices/Image/image.route.js';

const router = express.Router();

const apiPath = '/api';

router.use(`${apiPath}/user`, userRouter);
router.use(`${apiPath}/session`, sessionRouter);
router.use(`${apiPath}/orderRequest`, orderRequestRouter);
router.use(`${apiPath}/generalInfo`, generalInfoRouter);
router.use(`${apiPath}/inventory`, inventoryRouter);
router.use(`${apiPath}/orderDetail`, orderDetailRouter);
router.use(`${apiPath}/product`, productRouter);
router.use(`${apiPath}/image`, imageRouter);

router.get('*', (req, res) => {
  res.sendFile(`${global.dirname}/public/index.html`);
});

export default router;
