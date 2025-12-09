const express = require('express');

const app = express();


// app.use('/', (req,res) => {
//     res.send('Parent route')
// })

app.get('/user',(req,res) => {
    // res.send('hello from the server');
    console.log(req.query);
    res.send({firstName : 'Sai', secondName : 'Prasad'});
});

app.get('/user/:userId/:name/:password',(req,res) => {
    // res.send('hello from the server');
    // console.log(req)
    console.log(req.params);
    res.send({firstName : 'Sai', secondName : 'Prasad in userId'});
});


app.post('/user',(req,res) => {
    // res.send('hello from the server');
    res.send('data served');
});

// app.use("/", (req, res) => {
//     res.send('hello')
// })

app.get(/a/, (req,res) => {
    res.send('different routing styles');
});

// Get API
app.get('/user', async (req,res) => {
    const email  = req.body.emailId;
    console.log('req.body', req.body)
    try {
        const user = await User.find({emailId : email});
        if(user.length == 0)
            res.status(404).send('user not found');
        else
            res.send('user details fetched',user);
    } catch(err){
        res.status(400).send('something went wrong while fetching user');2
    }

})
// feed api - get all users from database
app.get('/feed', async (req,res) => {
     
   try {
        const users = await User.find({});
        res.send(users)
   }catch(err){

   }
})

// Delete a user from database
app.delete('/user', async (req,res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send('User deleted successfully');
    }catch(err){
    }
}) 

// Update a user
// app.patch('/user', async (req,res) => {
//     // const userId = req.body.userId;
//     const emailId = req.body.emailId;
//     const data = req.body;
//     try {
//         await User.findByIdAndUpdate(emailId , data);
//         res.send("User updated successfully");
//     } catch(err){
//         res.status(400).send("Something went wrong : err", err);
//     }
// });

// Update a user , by email id
app.patch('/user', async (req,res) => {
    const emailId = req.body.emailId;
    console.log('emailId', emailId);
    const data = req.body;
    console.log('data', data);
    const ALLOWED_UPDATES = ["userId", "photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

    if (!isUpdateAllowed) {
        throw new Error("Update not allowed");
    }
    if ( data?.skills?.length > 10){
        throw new Error("Skills can't be more than 10");
    }
    try {
        await User.findOneAndUpdate({emailId : emailId} , data, {
            runValidators : true
        });
        res.send("User updated successfully");
    } catch(err){
        res.status(400).send("Something went wrong : err" + err.message);
    }
});



app.listen(3000, () => {
    console.log('server is listening on port 3000')
});
