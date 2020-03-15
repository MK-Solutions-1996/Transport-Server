const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const zoneSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    mainZone: {
        type: String,
        required: [true, 'Required'],
        unique: true
    }
});

zoneSchema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });

module.exports = mongoose.model('Zone', zoneSchema);