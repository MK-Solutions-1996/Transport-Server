const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

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
    }
});


adminSchema.methods.confirm_password_operation = function confirm_password_operation(pw, cpw) {

    var validity = true;

    if (pw === "") {
        this.invalidate('password', { message: 'Required' });
        validity = false;
    }
    else if (pw.length < 8) {
        this.invalidate('password', { message: '8 characters Required' });
        validity = false;
    }
    if (cpw === "") {
        this.invalidate('confirmPassword', { message: 'Required' });
        validity = false;

    }
    if (validity) {
        if (pw === cpw) {
            bcrypt
                .hash(pw, 10)
                .then(hash => {
                    this.password = hash;
                    return true;
                })
                .catch(() => {
                    this.invalidate('password', { message: 'Encryption error' });

                });
        }
        else {
            this.invalidate('password', { message: 'Password not matched' });
        }
    }
    return false;
}

adminSchema.plugin(uniqueValidator, { message: '{VALUE} is already exists' });


module.exports = mongoose.model('Admin', adminSchema);