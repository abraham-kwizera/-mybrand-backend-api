import errorMessage from '../handlers/errorHandler.js';
import successMessage from '../handlers/successHandler.js';
import Message from '../models/contactsMessageModel.js'

// Messages 
// send Message 
export const sendMessage = async(req, res) => {
    const { name, email, location, message } = req.body;
    const isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    try {
        if (!email.match(isEmail)) {
            return errorMessage(res, 401, 'Invalid Email Address');
        }
        if (name.length < 2) {
            return errorMessage(res, 400, 'Fill in your full names');
        }
        if (!message) errorMessage(res, 500, 'Some filed are not field');
        const newMessage = await Message.create({
            name,
            email,
            location,
            message,
        });
        return successMessage(res, 201, 'Your message has been successfully sent', newMessage);
        // return res.status(201).json({ message: 'Your message has been successfully sent' })
    } catch (error) {
        // return errorMessage(res, 500, 'Error in sending message, Try again');
        return res.status(401).json({ message: 'Error in sending message', error: error.stack });
    }
};

// get all messages from the server
export const getAllMessages = async(req, res) => {
    try {
        const messages = await Message.find();
        return successMessage(res, 200, 'All messages successfully retrieved', {
            totalMessages: messages.length,
            messages,
        });
    } catch (error) {
        return errorMessage(res, 500, 'There is Error when retrieving All messages ', error.stack);
    }
};

// delete One Message 
export const deleteOneMessage = async(req, res) => {
    try {
        const foundMessage = await Message.findByIdAndDelete(req.params.id);
        if (!foundMessage) return errorMessage(res, 404, 'cant find that message');

        return res.json({ message: 'Deleted message successfully' })
    } catch (error) {
        return res.json({ message: 'There was error deleting message' })
    }
}