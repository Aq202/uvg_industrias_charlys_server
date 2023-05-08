import express from 'express';
import { renderIndexPage } from './general.controller.js';

const generalRouter = express.Router();

generalRouter.use('/', renderIndexPage);

export default generalRouter;
