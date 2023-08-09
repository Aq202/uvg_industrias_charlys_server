import express from 'express';
import { getOrderRequestImageController, getProductImageController } from './image.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';
import ensureAdminOrClientAuth from '../../middlewares/ensureAdminOrClientAuth.js';

const imageRouter = express.Router();

imageRouter.get('/orderRequest/:id', ensureAdminAuth, getOrderRequestImageController);
imageRouter.get('/product/:id', ensureAdminOrClientAuth, getProductImageController);

export default imageRouter;
