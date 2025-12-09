const express = require("express");

const app = express();


// app.get("/", 
//     (req,res,next) => {
//     // console.log(req.params);
//     console.log('hello from routehandler 1')
//     next();
//     // res.send('hello from routehandler 1')
// },
// (req,res,next) => {
//     // console.log(req.params);
//     console.log('hello from routehandler 2')
//     next()
//     res.send('hello from routehandler 2')
// })



app.use("/", (req,res,next) => {
    req.user = { firstName : 'Sai'};
    next();
})

app.use("/", (req,res,next) => {
    console.log(' in first req.user/', req.user);
    next();
})


app.use("/", (req,res,next) => {
    const newObj = {...req.user, ["secondName"] : 'Prasad'}
    req.user = newObj
    console.log('in second req.user', req.user)
    res.send('in second');
    next();
})
app.get("/users", 
    (req,res,next) => {
    // console.log(req.params);
    console.log('hello from routehandler 1')
    next();
    // res.send('hello from routehandler 1')

});

app.get("/users",
(req,res,next) => { 
    // console.log(req.params);
    console.log('hello from routehandler 2')
    res.send('hello from routehandler 2')
})
app.listen(3000, () => {
    console.log('Server running at 3000')
})