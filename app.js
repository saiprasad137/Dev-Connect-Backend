const express = require('express');
const {connectDB} = require('./config/database')
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req,res) => {
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
app.post('/login', async (req,res) => {
    try {
        const {emailId, password} = req.body;

        const user = await User.findOne({ emailId : emailId});
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

app.get('/profile', userAuth, async (req,res) => {

    try {
    const cookie = req.cookies;
    console.log('cookie', cookie);

    const { token } = cookie;
     if ( !token )
        throw new Error('Invalid Token');
    const decodedMsg = await jwt.verify(token , 'vodelasaiprasad');

    const { _id } = decodedMsg;
    
    const user = await User.findById(_id);
    console.log('logged in user is : ' + user.firstName);
    if ( !user )
        throw new Error("User invalid");

    res.send('User :'+ user);
    } catch(err) {
        res.status(400).send('Error while accessing profile : ' + err)
    }
})


app.post('/sendConnectionRequest',userAuth, (req,res,next) => {
    // Sending a connection request

    console.log('Sending a connection request');

    res.send(req.user.firstName + ' logged into his profile')
})


connectDB().then(() => {
    console.log('database connection extablished')
    app.listen(3000, () => {
    console.log('connected to port 3000')
})
 }).catch(err => {
    console.log('database connection not established')    
 })

