const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    empNo: { //employeee number
        type: String,
        required: [true, 'Required'],
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'Required']
    },
    type: {
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

    password: {
        type: String,
        required: [true, 'Required'],
        minlength: [8, '8 Characters required']
    }
});

userSchema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });

module.exports = mongoose.model('User', userSchema);