import express from 'express';
import { renderIndexPage } from './general.controller.js';

const generalRouter = express.Router();

generalRouter.get('/', renderIndexPage);

export default generalRouter;
