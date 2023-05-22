import express from 'express';
import { uploadImageController } from './image.controller.js';
import uploadClientImage from '../../services/uploadFiles/uploadImage.js';
import multerMiddleware from '../../middlewares/multerMiddleware.js';
import validateBody from '../../middlewares/validateBody.js';
import loginSchema from '../../utils/validationSchemas/loginSchema.js';

const imageRouter = express.Router();

imageRouter.post('/', multerMiddleware(uploadClientImage.any()), validateBody(loginSchema), uploadImageController);

export default imageRouter;
