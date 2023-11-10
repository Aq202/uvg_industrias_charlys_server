import express from 'express';
import { getOrderRequestImageController, getProductImageController } from './image.controller.js';

const imageRouter = express.Router();

imageRouter.get('/orderRequest/:id', getOrderRequestImageController);
imageRouter.get('/order/:id', getOrderRequestImageController);
imageRouter.get('/product/:id', getProductImageController);
imageRouter.get('/productModel/:id', getProductImageController);

export default imageRouter;
