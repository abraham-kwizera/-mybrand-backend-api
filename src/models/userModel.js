import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    provider: {
        type: String,
        default: 'email'
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

// const registerSchema = new mongoose.Schema({
//     name: { type: String },
//     email: {
//         type: String

//     },
//     provider: { type: String, default: 'email' },
//     password: { type: String },
// });



export default mongoose.model('userModel', registerSchema);