import express from 'express';
import { getOrderRequestImageController } from './image.controller.js';
import ensureAdminAuth from '../../middlewares/ensureAdminAuth.js';

const imageRouter = express.Router();

imageRouter.get('/orderRequest/:id', ensureAdminAuth, getOrderRequestImageController);

export default imageRouter;
