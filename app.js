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


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)

connectDB().then(() => {
    console.log('database connection extablished')
    app.listen(3000, () => {
    console.log('connected to port 3000')
})
 }).catch(err => {
    console.log('database connection not established')    
 })

