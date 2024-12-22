const ConnRequest = require("../models/connRequest");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/responseHandler");
const SAFE_USER_DATA_STR = 'firstName lastName age gender photoUrl about skills'
const User = require('../models/user');

const getReceievedConnections = async (req, res, next) => {
    const user = req.user;
    try {
        const getReceievedConnection = await ConnRequest.find({
            toUserId: user._id,
            status: 'interested'
        }).populate('fromUserId', SAFE_USER_DATA_STR);

        if (!getReceievedConnection) throw new AppError('connections not found!', 404, []);

        successResponse(res, `Connections fetched successfully!`, 200, getReceievedConnection);


    } catch (error) {
        next(error);
    }
}

const getConnections = async (req, res, next) => {
    const user = req.user;
    try {
        let connections = await ConnRequest.find({
            $or: [
                { fromUserId: user._id, status: 'accepted' },
                { toUserId: user._id, status: 'accepted' }
            ]
        })
            .populate("fromUserId", SAFE_USER_DATA_STR)
            .populate('toUserId', SAFE_USER_DATA_STR);

        if (!connections) throw new AppError('connections not found!', 404, []);

        connections = connections.map(field => {
            if (field.fromUserId._id.toString() === user._id.toString()) {
                return field.toUserId
            }
            return field.fromUserId
        });

        successResponse(res, 'Your connections fetched successfully!', 200, connections);

    } catch (error) {
        next(error);
    }
}

const getFeeds = async (req, res, next) => {
    const user = req.user;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;

    try {

        const everyConnections = await ConnRequest.find({
            $or: [
                { fromUserId: user._id }, { toUserId: user._id }
            ]
        }).select('fromUserId toUserId');

        const hideUsersFromFeed = new Set();

        everyConnections.forEach(conn => {
            hideUsersFromFeed.add(conn.toUserId)
            hideUsersFromFeed.add(conn.fromUserId)
        });

        const dbQuery = {
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: user._id } }
            ]
        };

        const users = await User.find(dbQuery).select(SAFE_USER_DATA_STR).skip(skip).limit(limit);
        const totalRecords = await User.countDocuments(dbQuery);

        successResponse(res, 'feed fetched successfully!', 200, users, {
            currentPage: page,
            limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit)
        });

    } catch (error) {
        next(error);
    }
}

// const getReceievedConnections = async (req, res, next) => {
//     try {

//     } catch (error) {
//         next(error);
//     }
// }

module.exports = {
    getReceievedConnections,
    getConnections,
    getFeeds
}