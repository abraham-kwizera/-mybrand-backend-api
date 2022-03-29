import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import session from 'express-session';
import errorMessage from '../handlers/errorHandler.js';
import successHandler from '../handlers/successHandler.js';
import userModel from '../models/userModel.js';


// get all users info
export const getAllUsers = async(req, res) => {
    try {
        const users = await userModel.find();
        successHandler(res, 200, 'All users successfully retrieved', {
            totalUsers: users.length,
            users,
        });
    } catch (error) {
        return errorMessage(res, 500, 'All users to be retrieved error');
    }
};

// get a single user
export const getOneUser = async(req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: { user }
        })
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            error: error.stack
        })
    }
}

// register user
export const registerUser = (req, res) => {
    const { firstName, lastName, userName, email, password, confirmPassword, role } = req.body;

    const isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    try {
        if (!email.match(isEmail)) {
            return errorMessage(res, 401, 'Invalid Email Address');
        }
        if (firstName.length < 2) {
            return errorMessage(res, 400, 'Fill in your real first name');
        }
        if (lastName.length < 2) {
            return errorMessage(res, 400, 'Fill in your real last name');
        }
        if (userName.length < 2) {
            return errorMessage(res, 400, 'Fill in your prefered userName');
        }
        if (password.length < 6) {
            return errorMessage(res, 400, 'Fill in a strong password');
        }
        if (confirmPassword.length < 6) {
            return errorMessage(res, 400, 'Fill in a strong password');
        }
        if (password !== confirmPassword) {
            return errorMessage(res, 400, 'Make sure your password are the same');
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                throw new Error();
            }
            const user = userModel.create({
                firstName,
                lastName,
                userName,
                email,
                password: hash,
                confirmPassword: hash,
                role
            });
            return res.status(201).json({
                status: 'success',
                message: `User ${firstName} ${lastName} Is Created Successfully`,
                data: {
                    firstName,
                    lastName,
                    userName,
                    email,
                    password: hash,
                    confirmPassword: hash,
                    role
                }
            });
        });

    } catch (error) {
        console.log(error.stack);
        return errorMessage(res, 500, 'User Registration error, Try again...');
    }
};

// update user info 
export const updateOneUser = async(req, res) => {

    try {
        const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            message: `User ${req.body.name} info is updated successfully`,
            data: { user }
        })
    } catch (error) {
        res.status(404).json({
            status: 'Failed to update the user info',
            error: error.stack
        })
    }
}

// Login 
export const login = async(req, res) => {
    const { email, password } = req.body;
    const findUser = await userModel.find({ email });
    console.log(findUser);
    if (findUser) {
        try {
            bcrypt.compare(password, findUser[0].password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ email: findUser[0].email, id: findUser[0]._id },
                        process.env.JWT_KEY, {
                            expiresIn: '1h',
                        },
                    );
                    return successHandler(res, 200, 'Login successfully', {
                        user: findUser,
                        token,

                    });
                }
            });
        } catch (error) {
            return errorMessage(res, 500, 'Login failed');
        }
    } else {
        return errorMessage(res, 404, 'Invalid Email or Password');
    }
};

//  Logout 
export const logout = (req, res) => {
    try {
        res.clearCookie('jwt')
        res.clearCookie(process.env.JWT_KEY)
        req.session.destroy()

        return successHandler(res, 200, 'Logged out successfully')
    } catch (error) {
        return errorMessage(res, 401, 'Only a logged in user can log out.')

    }
}

// delete a single user
export const deleteOneUser = async(req, res) => {
    try {
        const foundUser = await userModel.findByIdAndDelete(req.params.id);
        if (!foundUser) return errorMessage(res, 404, 'cant find that user');

        // res.status(204).json({
        //     status: 'success',
        //     message: 'User deleted successfully'
        // }) 

        return res.json({ message: 'User deleted successfully' })
    } catch (error) {
        // res.status(404).json({status: 'Fail',error: error.stack})
        return res.json({ message: 'There was error deleting post' })

    }
}

// export { getAllUsers, getOneUser, login, registerUser, updateOneUser, deleteOneUser as default }