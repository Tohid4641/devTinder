const validator = require('validator');
const AppError = require('./AppError');

const signupValidator = (data) => {
    const { firstName, lastName, emailId, password } = data;
    if (!firstName || !lastName) {
        throw new AppError("Name is not valid", 400);
    } else if (!validator.isEmail(emailId)) {
        throw new AppError("Email is not valid", 400);
    } else if (!validator.isStrongPassword(password)) {
        throw new AppError('Please enter a strong password', 400);
    }
}

const loginValidator = (data) => {
    const { emailId, password } = data;
    if (!emailId || !password) {
        throw new AppError("Invalid Credentials", 400);
    } else if (!validator.isEmail(emailId)) {
        throw new AppError("Invalid Credentials", 400);
    }
}

const updatePasswordValidator = (data) => {
    const { newPassword, oldPassword, emailId } = data;

    if (!newPassword || !oldPassword || !emailId) {
        throw new AppError("Please enter a valid inputs!", 400);
    } else if (!validator.isEmail(emailId)) {
        throw new AppError("Invalid email Id", 400);
    } else if (!validator.isStrongPassword(newPassword)) {
        throw new AppError("Please choose a strong password!", 400);
    }
}

const sendConnRequestValidator = (data) => {
    const { status, toUserId } = data;

    const allowedStatuses = ["ignored", "interested"];

    if (!status || !toUserId) throw new AppError("Please enter a valid inputs!", 400);

    if (!allowedStatuses.includes(status)) throw new AppError("Please enter a valid status inputs!", 400);
};

const getConnRequestsValidator = (data) => {
    const { status } = data;

    const allowedStatuses = ["ignored", "interested", "accepted", "rejected"];

    if (!allowedStatuses.includes(status)) throw new AppError("Please enter a valid status inputs!", 400);
};

const acknowlageConnRequestValidator = (data) => {
    const { status, requestId } = data;

    const allowedStatuses = ["accepted", "rejected"];

    if (!status || !requestId) throw new AppError("Please enter a valid inputs!", 400);

    if (!allowedStatuses.includes(status)) throw new AppError("Please enter a valid status inputs!", 400);
}

const createPaymentOrderValidator = (data) => {
    const { amount, subscriptionType } = data;

    if (!amount || !subscriptionType) throw new AppError("Please enter a valid inputs!", 400);

    if (!validator.isNumeric(amount.toString())) throw new AppError("Please enter a valid amount!", 400);

    if (!validator.isIn(subscriptionType, ["silver", "gold"])) throw new AppError("Please enter a valid subscription type!", 400);

    if (subscriptionType === "silver" && amount !== Number(process.env.SILVER_SUBSCRIPTION_AMMOUNT)) throw new AppError("Please enter a valid amount!", 400);
    if (subscriptionType === "gold" && amount !== Number(process.env.GOLD_SUBSCRIPTION_AMMOUNT)) throw new AppError("Please enter a valid amount!", 400);

}

module.exports = {
    signupValidator,
    loginValidator,
    updatePasswordValidator,
    sendConnRequestValidator,
    getConnRequestsValidator,
    acknowlageConnRequestValidator,
    createPaymentOrderValidator
}