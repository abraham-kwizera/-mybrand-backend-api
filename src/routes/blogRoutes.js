import express from 'express';
import { comment, deletePost, getAllPosts, getAllSubscribers, getAllCommentsOnPost, getOnePost, like, oneComment, subscribe, updatePost, createPost } from '../controllers/blogControllers.js';
import { protect, restrictTo } from '../midlewares/auth.js';

const blogRouter = express.Router();
blogRouter.route('/').post(protect, restrictTo('admin'), createPost).get(getAllPosts);
blogRouter.route('/subscribe').post(subscribe).get(protect, restrictTo('admin'), getAllSubscribers);
blogRouter.route('/:id').get(getOnePost).patch(protect, restrictTo('admin'), updatePost).delete(protect, restrictTo('admin'), deletePost).put(protect, restrictTo('user'), like);
blogRouter.route('/:id/comment').post(protect, restrictTo('user'), comment);
blogRouter.route('/:id/allComments').get(protect, restrictTo('admin'), getAllCommentsOnPost);
blogRouter.route('/comments/:id').get(protect, restrictTo('admin'), oneComment);

export default blogRouter;