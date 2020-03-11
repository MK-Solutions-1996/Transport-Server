const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const testSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true
    }
});

testSchema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });

module.exports = mongoose.model('Test', testSchema);