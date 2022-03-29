const successMessage = (res, status, message, data) => {
    res.status(status).json({
        success: true,
        status,
        message,
        data,
        token: data.token
    });
};

// const loginMessage = (res, status, message, data) => {
//     res.status(status).json({
//         success: true,
//         message,
//         token: data.token
//     })
// }
export { successMessage as default }