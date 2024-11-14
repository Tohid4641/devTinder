const validators = require('../utils/validators');
const User = require('../models/user');
const bcrypt = require('bcrypt');


const signup = async (req, res, next) => {
    try {
        validators.signupValidator(req.body);

        const hashPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            ...req.body,
            password: hashPassword
        });

        await user.save();
        res.status(201).send("signup successfull!");
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        validators.loginValidator(req.body);

        const { emailId, password } = req.body;

        const user = await User.findOne({emailId});

        if(!user) throw new Error("Invalid credentials");

        const isPasswordValid = await user.validatePassword(password);

        if(!isPasswordValid) throw new Error("Invalid credentials");

        const token = await user.getJWT();

        res.cookie('token', token);

        res.status(200).send("login successfull!");
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signup,
    login
}