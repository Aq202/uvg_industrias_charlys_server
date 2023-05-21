import express from 'express';
import generalRouter from '../apiServices/general/general.route.js';
import userRouter from '../apiServices/user/user.route.js';
import sessionRouter from '../apiServices/session/session.route.js';
import orderRequestRouter from '../apiServices/orderRequest/orderRequest.route.js';
import generalInfoRouter from '../apiServices/generalInfo/generalInfo.route.js';
import inventoryRouter from '../apiServices/inventory/inventory.route.js';
import orderDetailRouter from '../apiServices/orderDetail/orderDetail.route.js';
import productRouter from '../apiServices/product/product.route.js';

const router = express.Router();

router.use('/', generalRouter);

const apiPath = '/api';

router.use(`${apiPath}/user`, userRouter);
router.use(`${apiPath}/session`, sessionRouter);
router.use(`${apiPath}/orderRequest`, orderRequestRouter);
router.use(`${apiPath}/generalInfo`, generalInfoRouter);
router.use(`${apiPath}/inventory`, inventoryRouter);
router.use(`${apiPath}/orderDetail`, orderDetailRouter);
router.use(`${apiPath}/product`, productRouter);

export default router;
