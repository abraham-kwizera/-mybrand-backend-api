import express from 'express';
import { getAllUsers, getOneUser, login, registerUser, updateOneUser, deleteOneUser } from '../controllers/userControllers.js';
import { protect, restrictTo } from '../midlewares/auth.js';

const userRouter = express.Router();
// get homepage and get all users
userRouter.route('/').get(protect, restrictTo('admin'), getAllUsers);
// user login
userRouter.route('/login').post(login);
userRouter.route('/:id').get(protect, restrictTo('admin'), getOneUser).patch(protect, restrictTo('admin'), updateOneUser).delete(protect, restrictTo('admin'), deleteOneUser);
// create a user ---- /register
userRouter.route('/register').post(registerUser);
// export userRouter
export { userRouter as default }