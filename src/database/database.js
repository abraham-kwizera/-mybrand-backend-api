import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" })

const { MONGO_URL, MONGO_URL_TEST, NODE_ENV } = process.env;
const connectDb = () => {
    mongoose
        .connect(NODE_ENV === 'test' ? MONGO_URL_TEST : MONGO_URL)
        .then(console.log('Database connected successfully ...'));
};

export { connectDb as default }