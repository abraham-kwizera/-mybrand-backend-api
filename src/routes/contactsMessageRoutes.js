import express from 'express';
import { sendMessage, getAllMessages, deleteOneMessage } from '../controllers/contactsMessageControllers.js';
import { protect, restrictTo } from '../midlewares/auth.js';

const contactsMessageRouter = express.Router();
contactsMessageRouter.route('/').post(sendMessage).get(protect, restrictTo('admin'), getAllMessages);
contactsMessageRouter.route('/:id').delete(protect, restrictTo('admin'), deleteOneMessage)

export default contactsMessageRouter;