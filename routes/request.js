const express = require('express');
const { userAuth } = require('../middlewares/auth')
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();


requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res, next) => {
    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedstatus = ['interested', 'ignore'];

      
        if (!allowedstatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid status type :' + status });
        }

        const findToUser = await User.findById(toUserId);
        if (!findToUser)
            res.status(400).send({ message: 'To User does not exist' })

        // if there is an existing connectionReq 
        const existingConnectionRequest = await connectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest)
            return res.status(400).send({ message: 'Duplicate connection request' });


        const newConnectionRequest = new connectionRequest({
            fromUserId,
            toUserId,
            status
        });
        console.log('new con req in API Endpoint', newConnectionRequest);
        const data = await newConnectionRequest.save();

        res.json({
            message: req.user.firstName + " is " + status + " in "+ findToUser.firstName,
            data
        })
    } catch (err) {
        res.status(400).send('Error while sending interested req:' + err.message)
    }
})

module.exports = requestRouter;