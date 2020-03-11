const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    empNo: {
        type: String,
        required: [true, 'Required'],
        unique: true
    },

    firstName: {
        type: String,
        required: [true, 'Required']
    },

    email: {
        type: String,
        required: [true, 'Required'],
        unique: true,
        validate: {
            validator: function (v) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: 'Invalid email',
        }
    },

    type: {
        type: String,
        required: [true, 'Required']
    },

    username: {
        type: String,
        required: [true, 'Required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Required'],
        minlength: [8, '8 Characters required']
    }
});

adminSchema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });

module.exports = mongoose.model('Admin', adminSchema);