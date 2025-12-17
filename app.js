const express = require('express');
const { connectDB } = require('./config/database')
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');
const cors = require('cors');

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter);

connectDB().then(() => {
  console.log('database connection extablished')
  app.listen(3000, () => {
    console.log('connected to port 3000')
  })
}).catch(err => {
  console.log('database connection not established'+ err)
})

