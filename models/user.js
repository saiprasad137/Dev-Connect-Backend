const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Invalid email address ' + value);
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value))
                throw new Error('Enter a Strong password' + value);
        }
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'others'],
            message: `{VALUE} is not valid gender type`
        },
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: 'absbbs.png'
    },
    about: {
        type: String,
        default: "This is a random default value"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
})

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = jwt.sign({
        _id: user._id
    }, "vodelasaiprasad", { expiresIn: "7d" })

    return token;
}

userSchema.methods.passwordCompare = async function (passwordInputByUser) {
    const user = this;

    const passwordHash = user.password
    return bcrypt.compare(passwordInputByUser, passwordHash);
}

module.exports = mongoose.model('User', userSchema);