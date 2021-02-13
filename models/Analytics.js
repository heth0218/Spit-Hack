const mongoose = require('mongoose');
const Outlet = require('./Outlet');
const User = require('./User');

const AnalyticsSchema = mongoose.Schema({
    brandName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    analysisData: [{
        brand: String,
        number: String,
        percentageShare: String
    }],
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