const mongoose = require('mongoose');
const Outlet = require('./Outlet');
const User = require('./User');

const AnalyticsSchema = mongoose.Schema({
    brandName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    mycompanyPercentage: {
        type: String,
        required: true
    },
    mycompanyCount: {
        type: String,
        required: true
    },
    othercompanyPercentage: {
        type: String,
        required: true
    },
    othercompanyCount: {
        type: String,
        required: true
    },
    video: {
        type: String
    },
    outlet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Outlet
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('analytics', AnalyticsSchema);