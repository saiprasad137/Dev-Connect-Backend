const express = require('express');
const { userAuth } = require('../middlewares/auth')


const requestRouter = express.Router();


requestRouter.post('/sendConnectionRequest',userAuth, (req,res,next) => {
    // Sending a connection request

    console.log('Sending a connection request');

    res.send(req.user.firstName + ' logged into his profile')
})

module.exports = requestRouter;