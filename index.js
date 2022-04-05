import express from 'express';
import upload from 'express-fileupload';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRouter from './src/routes/userRoutes.js'
import blogRouter from './src/routes/blogRoutes.js'
import contactsMessageRouter from './src/routes/contactsMessageRoutes.js'
import connectDb from './src/database/database.js';
import errorMessage from './src/handlers/errorHandler.js';

const app = express();
const port = process.env.PORT || 3001;
connectDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload({ useTempFiles: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use('/users', userRouter);
app.use('/blogs', blogRouter);
app.use('/contactsMessage', contactsMessageRouter);
app.use((req, res) => {
    errorMessage(res, 404, 'This Route is missing');
});

//port listening on
app.listen(port, function() {
    console.log(`Listening to port ${port}`);
})


export default app;