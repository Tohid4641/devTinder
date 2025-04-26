const { successResponse } = require('../utils/responseHandler');
const validators = require('../utils/validators');
const AppError = require('../utils/AppError');
const User = require('../models/user');
const ConnRequest = require('../models/connRequest');
const sendEmail = require("../utils/sendEmail");

const getConnRequests = async (req, res, next) => {
    try {

        if (Object.keys(req.query).length !== 0) validators.getConnRequestsValidator(req.query);

        const user = req.user;
        const status = req.query.status;

        const allConnections = await (
            status ?
                ConnRequest.find({
                    $and: [
                        { fromUserId: user._id },
                        { status }
                    ]
                }) :

                ConnRequest.find({
                    $or: [
                        { fromUserId: user._id },
                        {
                            $and: [
                                { toUserId: user._id },
                                { status: "interested" }
                            ]
                        },

                    ]
                })
        )

        if (allConnections.length === 0) throw new AppError("connections not found", 404, []);

        successResponse(res, `Your all connections`, 200, allConnections)
    } catch (error) {
        next(error)
    }
};

const sendConnRequest = async (req, res, next) => {
    try {
        validators.sendConnRequestValidator(req?.params);

        const { status, toUserId } = req?.params;
        const user = req.user;
        const fromUserId = user._id;

        const toUser = await User.findOne({ _id: toUserId });

        if (!toUser) throw new AppError('User not found!', 404);

        const isConnRequestExist = await ConnRequest.findOne(
            {
                $or: [
                    { fromUserId: fromUserId, toUserId: toUserId },
                    { fromUserId: toUser, toUserId: fromUserId }
                ]
            }
        );

        if (isConnRequestExist) throw new AppError("Connection request already sent.", 409);

        const connRequest = new ConnRequest({
            fromUserId,
            toUserId,
            status
        });

        await connRequest.save();

        // const emailRes = await sendEmail.run(
        //   "A new friend request from " + req.user.firstName,
        //   req.user.firstName + " is " + status + " in " + toUser.firstName
        // );
        // console.log(emailRes);

        successResponse(res, `${user.firstName} is sent connection request ${status} to ${toUser.firstName}!`, 200, connRequest)
    } catch (error) {
        next(error)
    }
}

const acknowlageConnRequest = async (req, res, next) => {
    try {
        validators.acknowlageConnRequestValidator(req?.params);

        const { status, requestId } = req?.params;
        const user = req.user;

        const connReq = await ConnRequest.findOne({
            _id: requestId,
            toUserId: user._id,
            status: "interested"
        });

        if (!connReq) throw new AppError("Connection request not found", 404, []);

        connReq.status = status;

        const data = await connReq.save();

        successResponse(res, `${user.firstName} is ${status} the connection request!`, 200, data)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getConnRequests,
    sendConnRequest,
    acknowlageConnRequest
}