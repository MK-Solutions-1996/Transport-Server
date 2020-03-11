const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const driverScheema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    driverName: {
        type: String,
        required: [true, 'Required']
    },

    driverMobile: {
        type: String,
        required: [true, 'Required'],
        minlength: [10, 'Invalid number'],
        maxlength: [10, 'Invalid number'],

    },

    driverNic: {
        type: String,
        required: [true, 'Required'],
        unique: true,
        validate: {
            validator: function (v) {
                return /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/.test(v);
            },
            message: 'Invalid nic'
        },

    },

    driverLicenNo: {
        type: String
    },

    driverLicenExp: {
        type: String
    },

    ownerName: {
        type: String,
        required: [true, 'Required']
    },

    ownerMobile: {
        type: String,
        required: [true, 'Required'],
        minlength: [10, 'Invalid number'],
        maxlength: [10, 'Invalid number'],

    },

    vehicleNo: {
        type: String,
        required: [true, 'Required'],
        unique: true
    },

    vehicleCategory: {
        type: String,
    },

    vehicleCapacity: {
        type: Number,
        required: [true, 'Required']
    },

    vehicleType: {
        type: String,
        required: [true, 'Required']
    }
});


driverScheema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });




module.exports = mongoose.model('Driver', driverScheema);