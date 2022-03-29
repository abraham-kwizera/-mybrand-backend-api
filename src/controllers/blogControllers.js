import Post from '../models/blogModel.js';
import errorMessage from '../handlers/errorHandler.js';
import successMessage from '../handlers/successHandler.js';
import Subscriber from '../models/subscriberModel.js';
import Comment from '../models/commentModel.js';
import uploader from '../database/cloudinary.js';


// create a new post
export const createPost = (req, res) => {
    const { title, body } = req.body;
    Post.findOne({ title: `${title}` }, (err, result) => {
        if (result) {
            errorMessage(res, 500, 'The blog title provided is already exist');
        }
    });

    try {
        if (!title || title.length < 3) {
            return errorMessage(res, 500, ' please fill title correctly');
        }
        if (!body || body.length < 10) {
            return errorMessage(res, 500, ' please fill body correctly');
        }

        const post = Post.create({
            title,
            body,
            imageUrl: '',
            imageId: '',
            likes: 0,
            commentsCount: 0,
            views: 0,
            time: Date.now(),
        });
        if (req.files) {
            const tmp = req.files.image.tempFilePath;
            const result = uploader.upload(tmp, (_, result) => result);
            post.imageUrl = result.url;
            post.imageId = result.public_id;
            post.save();
        }
        return successMessage(res, 201, 'new post created successfully', post);
    } catch (error) {
        return errorMessage(res, 500, 'Failed to create a post', error);
    }
};

// retrieve all posts
export const getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find().sort({ time: -1 });
        return successMessage(res, 200, 'successfully read all posts', {
            postsCount: posts.length,
            posts,
        });
    } catch (error) {
        return errorMessage(res, 500, 'there was error getting all posts', error);
    }
};

// retrieve a single Post
export const getOnePost = async(req, res) => {
    try {
        const onePost = await Post.findById(req.params.id);
        onePost.views += 1;
        await onePost.save();
        return successMessage(res, 200, 'post got successfully', onePost);
    } catch (error) {
        return errorMessage(res, 404, 'not found on posts list', error);
    }
};

// update a single post
export const updatePost = async(req, res) => {
    try {
        let result;
        if (req.files) {
            const tmp = req.files.image.tempFilePath;
            result = await uploader.upload(tmp, (_, result) => result);
            req.body.imageUrl = result.url;
            req.body.imageId = result.public_id;
        }
        const updatedPost = await Post.findOneAndUpdate({ _id: req.params.id },
            req.body, { new: true },
        );
        if (!updatedPost) {
            return errorMessage(res, 404, " Can't find that post on list");
        }
        return successMessage(res, 201, 'Updated post successfully', updatedPost);
    } catch (error) {
        return errorMessage(res, 500, 'There was a problem updating post', error);
    }
};

// delete a single post
export const deletePost = async(req, res) => {
    try {
        const foundPost = await Post.findById(req.params.id);
        if (!foundPost) return errorMessage(res, 404, 'cant find that post');

        // if (foundPost.imageId) await uploader.destroy(foundPost.imageId);
        // await Post.deleteOne({ _id: foundPost._id });
        await Post.deleteOne(foundPost);
        // return successMessage(res, 200, 'Deleted post successfully');
        return res.json({ message: 'Deleted post successfully' })
    } catch (error) {
        // return errorMessage(res, 500, 'There was error deleting post');
        return res.json({ message: 'There was error deleting post' })
    }
};

// write a new comment to the post
export const comment = async(req, res) => {
    const { name, email, message } = req.body;
    try {
        if (!message) errorMessage(res, 500, 'Some filed are not field');
        if (message.length < 2) errorMessage(res, 500, 'Your comment is too short');

        const comment = await Comment.create({
            name,
            email,
            message,
            time: Date.now(),
        });
        if (!comment) return res.json({ message: 'Login first' });
        const post = await Post.findById(req.params.id);
        if (!post) errorMessage(res, 404, 'no such post found');
        post.comments.push(comment._id);
        post.commentsCount += 1;
        await post.save();

        return successMessage(res, 201, 'successfully commented', comment);
    } catch (error) {
        // return errorMessage(res, 500, 'there was error commenting');

        return res.json({ message: 'Login first' })
    }
};

// retrieve all comments
export const getAllCommentsOnPost = async(req, res) => {
    try {
        const foundPost = await Post.findById(req.params.id)
            .populate('comments')
            .sort({ time: -1 });
        return successMessage(
            res,
            200,
            'successfully fetched all comments',
            foundPost.comments,
        );
    } catch (error) {
        return errorMessage(res, 500, 'there was error fetching all comments');
    }
};

// retrieve one comment
export const oneComment = async(req, res) => {
    try {
        const oneCm = await Comment.findById(req.params.id);
        return successMessage(res, 200, 'this is one comment', oneCm);
    } catch (error) {
        return errorMessage(res, 500, 'failed to fetch that');
    }
};

// like a comment
export const like = async(req, res) => {
    try {
        const foundUser = await Post.findById(req.params.id);
        if (!foundUser) errorMessage(res, 404, 'cant find that post');
        foundUser.likes += 1;
        await foundUser.save();
        return successMessage(res, 200, 'successfully liked');
    } catch (error) {
        return errorMessage(res, 500, 'there was error while liking');
    }
};

// subscribe
export const subscribe = async(req, res) => {
    const { email } = req.body;
    const isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    try {
        if (!email.match(isEmail)) {
            return errorMessage(res, 401, 'Invalid Email Address');
        }
        const subscriber = await Subscriber.create({
            email: req.body.email,
            time: Date.now(),
        });
        successMessage(res, 201, 'Subscribed successfully', subscriber);

    } catch (error) {
        return res.json({ message: 'This email is already used' });
    }

};

// get all subscribers
export const getAllSubscribers = async(req, res) => {
    try {
        const allSubs = await Subscriber.find();
        return successMessage(res, 200, 'fetched all subscriber successfully', {
            subsCount: allSubs.length,
            subscribers: allSubs,
        });
    } catch (error) {
        return errorMessage(res, 500, 'Failed while fetching all subscribers');
    }
};