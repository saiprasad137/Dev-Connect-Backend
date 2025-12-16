const express = require('express');
const { userAuth } = require('../middlewares/auth')
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const { validateEditProfileData } = require('../utils/validation');

const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {

    try {
        const cookie = req.cookies;
        console.log('cookie', cookie);

        const { token } = cookie;
        if (!token)
            throw new Error('Invalid Token');
        const decodedMsg = await jwt.verify(token, 'vodelasaiprasad');

        const { _id } = decodedMsg;

        const user = await User.findById(_id);
        console.log('logged in user is : ' + user.firstName);
        if (!user)
            throw new Error("User invalid");

        res.send('User :' + user);
    } catch (err) {
        res.status(400).send('Error while accessing profile : ' + err)
    }
})

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR while viewing profile" + err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {

    try {
        console.log('req.body in profile edit' + req.body.age);

        if (!validateEditProfileData(req)) {
            throw new Error('Invalid Edit Request');
        }

        const loggedInUser = req.user;
        console.log('loggedinuser before', loggedInUser)

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        console.log('loggedinuser after changes', loggedInUser)
        await loggedInUser.save();
        res.json({
            message: ` Profile updated`,
            data: loggedInUser
        });
    } catch (err) {
        res.status(400).send('Error while editing profile : ' + err)
    }
})
module.exports = profileRouter;