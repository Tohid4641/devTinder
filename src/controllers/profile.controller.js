const { successResponse } = require('../utils/responseHandler');
const AppError = require('../utils/appError');
const User = require('../models/user');

const getProfile = async (req, res, next) => {
    const user = req.user;
    try {
        successResponse(res, 'User profile fetched', 200, user);
    } catch (error) {
        next(error)
    }
};

const updateProfile = async (req, res, next) => {
    const user = req.user;
    try {
        const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {returnDocument:'after'});

        const { password, emailId, ...otherData } = updatedUser._doc;

        successResponse(res, 'User profile updated successfully', 200, otherData);

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getProfile,
    updateProfile
}