const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest')

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


module.exports = userRouter