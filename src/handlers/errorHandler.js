const errorMessage = (res, status, message, error) => {
    res.status(status).json({
        success: false,
        message,
        error,
    });
};

export { errorMessage as default }