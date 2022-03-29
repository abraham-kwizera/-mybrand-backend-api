import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    imageId: { type: String },
    body: { type: String, required: true },
    time: { type: Date },
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
});

export default mongoose.model('Post', postSchema);