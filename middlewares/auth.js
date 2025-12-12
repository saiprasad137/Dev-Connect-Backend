
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminAuth = (req,res,next) => {

    const token = "xyz";
    const isAdminAuthorized = token === 'xyz';

    console.log('admin auth called');
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Admin");
    } else {
        next();
    }
}


const userAuth = async (req,res,next) => {

   try{ 
        const { token } = req.cookies;

        if(!token)
            throw new Error('Token is not valid');

        const decodedObj = await jwt.verify(token , 'vodelasaiprasad');

        // console.log('decoded obj', decodedObj);
        
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        
        if( !user )
            throw new Error('User not found');
        
        // console.log('user', user);
        req.user = user;
        next();
    } catch(err){
        res.status(400).send('ERROR : ' + err.message)
    }
}

module.exports = {
    adminAuth,
    userAuth
}