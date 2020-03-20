const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const employeeDataSchema = mongoose.Schema({
    _id: false,
    empNo: {
        type: String,
        required: [true, "Required"]
    },
    empName : {
        type: String,
        required: [true, "Required"]
    },
    locationId: {
        type: String,
        required: [true, "Required"]
    },
      locationName: {
        type: String,
        required: [true, "Required"]
    }
});



const shiftSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    shiftDate: {
        type: String,
        required: [true, "Required"],
        unique: true
    },

    startTime: {
        type: String,
        required: [true, "Required"]
    },

    endTime: {
        type: String,
        required: [true, "Required"]
    },

    employeeData: [employeeDataSchema],

    requestedBy: {
        empNo: {
            type: String,
            default: null
        },
        date: {
            type: String,
            default: null
        }
    },

    approvedBy: {
        empNo: {
            type: String,
            default: null
        },
        date: {
            type: String,
            default: null
        }
    },
});

shiftSchema.plugin(uniqueValidator, { message: '{PATH} is already exists' });
module.exports = mongoose.model('Shift', shiftSchema);