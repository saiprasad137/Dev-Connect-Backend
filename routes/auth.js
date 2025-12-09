const express = require('express');
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { userAuth } = require('../middlewares/auth');

const authRouter = express.Router();

authRouter.post('/signup', async (req,res) => {
    console.log(req.body); //initially will print undefined , but if we use express.json() as middleware , we get the required output.
    // create a new instance of user model  

    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        const user = new User({
            firstName, lastName , emailId , password : passwordHash
        })
        await user.save();
        res.send('User added successfully');
    } catch(err){
        res.status(400).send('Error saving the user' + err);
    }
})

// Login
authRouter.post('/login', async (req,res) => {
    try {
        const {emailId, password} = req.body;

        console.log('req.boidy', req.body)
        const user = await User.findOne({ emailId : emailId});
        console.log('user', user)
        if ( !user )
            throw new Error('Invalid Credentials');
        console.log('pw', password);
        console.log('user', user);
        const isPasswordValid = await user.passwordCompare(password);
        
        console.log('is valid pw', isPasswordValid);
        if ( isPasswordValid ){

            const token =  await user.getJWT();

            // Create a JWT Token
            console.log('token', token);
            res.cookie('token', token,{
                expires : new Date(Date.now() + 8 * 3600000),
            });

            // Attach it to a cookie and send reponse to user
            
            res.send("Logged in successfully");
        } else {
            throw new Error('Invalid Credentials');
        }
    } catch(err){
        res.status(400).send('Error while loggin in : ' + err)
    }
})

// Logout 
authRouter.post('/logout', async ( req,res) => {

    res.cookie("token", null, {
        expires : new Date(Date.now())
    }).send('Logged out successfully')
})
module.exports = authRouter;