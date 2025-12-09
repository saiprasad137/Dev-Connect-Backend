 const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://saiprasad12337:c3vmLx2O7ojNsCo8@rottenjudge-1.ah2urgh.mongodb.net/devTinder")
 };

module.exports = {
   connectDB
}