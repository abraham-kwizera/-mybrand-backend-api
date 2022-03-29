import mongoose from 'mongoose';

const commentsSchema = mongoose.Schema({
    name: { type: String, default: 'Anonymous' },
    email: { type: String, default: '' },
    message: { type: String, required: true },
    time: { type: Date, default: new Date() },
});
export default mongoose.model('Comment', commentsSchema);