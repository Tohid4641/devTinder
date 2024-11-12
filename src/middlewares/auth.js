const User = require('../models/user');
const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    const token = 'xyz';

    if (token === "xyz") {
        next()
    }

    res.status(401).json({
        "message": "Unauthorized Admin!!"
    });
}

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    try {
        if (!token) throw new Error('Unauthorized user!!');

        const decodeData = await jwt.verify(token, 'secret');

        if (!decodeData) throw new Error('Unauthorized user!!');

        const { _id } = decodeData;

        const user = await User.findById(_id);

        if (!user) throw new Error('User not found!');

        req.user = user;

        next();

    } catch (error) {
        next(error);
    }
}

module.exports = {
    adminAuth, userAuth
}