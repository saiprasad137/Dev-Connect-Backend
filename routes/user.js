const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest')
const User = require('../models/user');

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

userRouter.get('/user/requests/received', userAuth, async (req, res, next) => {


    try {

        const loggedInUser = req.user;

        const reqs = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', ['firstName', 'lastName']);


        console.log('user reqs ', reqs);
        res.json({
            message: 'Data fetched',
            reqs
        });
    } catch (err) {
        res.status(400).send('Error while using user router' + err.message);
    }
})


userRouter.get('/user/connections', userAuth, async (req, res, next) => {
    try {

        const loggedInUser = req.user;

        const connectionRequests = await connectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: 'accepted' },
                { fromUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString())
                return row.toUserId;
            return row.fromUserId;
        });
        res.json({ data });

    } catch (err) {
        res.status(400).send("Error while accessing user's connections " + err.message);
    }
})


userRouter.get('/feed', userAuth, async (req, res, next) => {

    // User should see all the user cards except
    // 1. His Own card
    // 2. His connections
    // 3. Ignored people
    // 4. already sent the connetion request

    // Example : 

    const loggedInUser = req.user;

    console.log('params', req.query);
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * 2;

    const connectionReqs = await connectionRequest.find({
        $or: [
            { fromUserId: loggedInUser._id },
            { toUserId: loggedInUser._id }
        ]
    }).select("fromUserId toUserId")


    const hideUsersFromFeed = new Set();
    connectionReqs.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
        $and: [
            { _id: { $ne: loggedInUser._id } },
            {
                _id: {
                    $nin: Array.from(hideUsersFromFeed)
                }
            }
        ]

    }).select('firstName lastName').skip(skip).limit(limit);

    console.log('users', users);
    res.json({ users: users })
})

module.exports = userRouter