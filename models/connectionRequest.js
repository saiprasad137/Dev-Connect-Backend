const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['ignore', 'interested', 'accepted', 'rejected'],
            message: `{VALUE} is not supported`
        }
    }
}, { timestamps: true })

// ConnectionRequest.find({ fromUserId : 36739247399374, toUserId : 638397483944});

connectionRequestSchema.index({fromUserId : 1, toUserId : 1});

connectionRequestSchema.pre('save', function() {
    const connectionRequest = this;

    if ( connectionRequest.fromUserId.equals(this.toUserId))
        throw new Error('cannot send connection request to yourself');
    // next();
})

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);