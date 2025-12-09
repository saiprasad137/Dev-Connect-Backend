const express = require('express');
const {adminAuth,userAuth} = require('./middlewares/auth')
const app =  express();

app.use('/getUserData', (req, res, next) => {
    
    // try {
        
        throw new Error('custom error');
        res.send(' All the user details')
    // } catch(err) {
        // res.status(500).send('in catch : something went wrong ')
        // }
        
    })
    
    
    app.get("/admin", adminAuth);
    
    app.get('/user', userAuth, (req,res) => {
        res.send('user here');
    })
    
    app.get('/admin/getAllData', (req,res) => {
        res.send('All Data Sent');
    })
    
    
    app.get('/admin/deleteUser', (req,res) => {
        res.send('User Deleted');
    })
    
    //**** Proper way of error handling is Try Catch */
    app.use("/", (err , req, res, next) => {

        if(err){
            res.status(500).send('something went wrong')
        }
    })

    app.listen('3000', () => {
        console.log('port 3000 connected');
    });