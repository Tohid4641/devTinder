const validator = require('validator');

const signupValidator = (data) => {
    const { firstName, lastName, emailId, password } = data;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error('Please enter a strong password');
    }
}

const loginValidator = (data) => {
    const { emailId, password } = data;
    if(!emailId || !password){
        throw new Error("Invalid Credentials");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Invalid Credentials");
    }
}

module.exports = {
    signupValidator,
    loginValidator
}