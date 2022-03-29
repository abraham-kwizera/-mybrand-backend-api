import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    name: { type: String, default: 'Anonymous' },
    email: { type: String, default: '', },
    location: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: Date, default: new Date() },
});
export default mongoose.model('Message', messageSchema);