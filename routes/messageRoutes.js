import express from 'express';
import { protect } from '../middlewares/auth.js';
import { textMessageController, imageMessageController } from '../controllers/messagecontroller.js';

const messageRouter = express.Router();

messageRouter.post('/text', protect, textMessageController);
messageRouter.post('/image', protect, imageMessageController);

export default messageRouter;
