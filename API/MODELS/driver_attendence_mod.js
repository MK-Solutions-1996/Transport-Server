const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const uniqueArrayValidator = require('mongoose-unique-array');


const detailsSchema = mongoose.Schema({
    _id: false,

    driverId: {
        type: String,
        required: [true, 'Required'],
    },
    availability: {
        ot: {
            type: Boolean,
            default: false
        },
        shift: {
            type: Boolean,
            default: false
        },
        do: {
            type: Boolean,
            default: false
        }
    }
});



const driverAttendenceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    date: {
        type: String,
        required: [true, 'Required'],
        unique: true
    },

    details: [detailsSchema]

});


driverAttendenceSchema.plugin(uniqueValidator, { message: '{PATH} is already exists' });
driverAttendenceSchema.plugin(uniqueArrayValidator);

module.exports = mongoose.model('DriverAttendence', driverAttendenceSchema);