import mongoose from 'mongoose';

const subscribersSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    time: { type: Date },
});

export default mongoose.model('Subscriber', subscribersSchema);