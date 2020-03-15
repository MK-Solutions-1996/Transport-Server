const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const citySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    cityName: {
        type: String,
        required: [true, 'Required'],
        unique: true
    },

    km: {
        type: Number,
        required: [true, 'Required'],
    },

    mainZone: {
        type: String,
        required: [true, 'Required'],
    },

    subZones: {
        type: [String],
        required: [true, 'Required'],
        validate: [arrayMinCheck, 'Sub zones required']
    }
});


function arrayMinCheck(key) {
    return key.length >= 1;
}

citySchema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });

module.exports = mongoose.model('City', citySchema);