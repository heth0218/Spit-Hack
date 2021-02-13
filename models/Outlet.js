const mongoose = require('mongoose');
const User = require('../models/User')

const OutletSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('outlet', OutletSchema);