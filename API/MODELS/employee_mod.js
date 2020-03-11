const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const employeeScheema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    empNo: {
        type: String,
        required: [true, 'Required'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Required'],
    },
    address: {
        type: String,
        required: [true, 'Required'],
    },
    city: {
        type: String,
        required: [true, 'Required'],
    },
    department: {
        type: String,
        required: [true, 'Required'],
    },
    nic: {
        type: String,
        required: [true, 'Required'],
        unique: true
    },
    mobile: {
        type: Number,
        required: [true, 'Required'],
        unique: true
    },
    bus: {
        type: String,
        required: [true, 'Required'],
    }
});

employeeScheema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });

module.exports = mongoose.model('Employee', employeeScheema);

