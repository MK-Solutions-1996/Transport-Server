const mongoose = require('mongoose');
const Shift = require('../MODELS/shift_mod');
const nodemailer = require('nodemailer');
const emailExistence = require('email-existence');

exports.save_shift = (body) => {
    return new Promise((resolve, reject) => {
        const shift = new Shift({
            _id: mongoose.Types.ObjectId(),
            shiftDate: body.shiftDate,
            startTime: body.startTime,
            endTime: body.endTime,
            employeeData: body.employeeData,
            requestedBy: body.requestedBy,
            approverdBy: body.approverdBy
        });

        shift
            .save()
            .then(() => {
                resolve({ status: 201, message: 'success' });
            })
            .catch(err => {
                const e = err.errors;
                if (e) {
                    reject({ status: 422, error: e });
                }
                else {
                    reject({ status: 500, error: err });
                }
            });
    });
}


exports.find_shifts = () => {
    return new Promise((resolve, reject) => {
        Shift
            .find()
            .select('_id shiftDate startTime endTime employeeData requestedBy approvedBy')
            .exec()
            .then(data => {
                if (data.length === 0) {
                    reject({ status: 404, error: 'No data found' });
                }
                else {
                    resolve({ status: 200, data: data });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            })
    });
}


exports.find_shift_by_shift_date = (shiftDate) => {
    return new Promise((resolve, reject) => {
        Shift
            .find({ shiftDate: shiftDate })
            .select('_id shiftDate startTime endTime employeeData requestedBy approvedBy')
            .exec()
            .then(data => {
                if (data.length === 0) {
                    reject({ status: 404, error: 'No data found' });
                }
                else {
                    resolve({ status: 200, data: data[0] });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    });
}

exports.update_shift = (id, body) => {
    return new Promise((resolve, reject) => {
        const update_operation = {};
        for (var operations of body) {
            update_operation[operations.key] = operations.value;
        }

        Shift
            .update({ _id: id }, { $set: update_operation }, { runValidators: true, context: 'query' })
            .exec()
            .then(result => {
                const updated_count = result.n;
                if (updated_count === 0) {
                    reject({ status: 404, error: 'No id found' });
                }
                else {
                    resolve({ status: 201, message: 'sucees' });
                }
            })
            .catch(err => {
                const e = err.errors;
                if (e) {
                    reject({ status: 422, error: e });
                }
                else {
                    reject({ status: 500, error: err });
                }
            });
    })
}

exports.update_shift_approve = (body) => {
    return new Promise((resolve, reject) => {
        const id = body.id;
        const empNo = body.empNo;
        const date = body.date;

        const update_operation = { empNo: empNo, date: date };

        Shift
            .updateOne({ _id: id }, { $set: { approvedBy: update_operation } })
            .exec()
            .then(result => {
                const updated_count = result.n;
                if (updated_count === 0) {
                    reject({ status: 404, error: 'No id found' });
                }
                else {
                    resolve({ status: 201, message: 'sucees' });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            })
    });
}

exports.remove_shift = (id) => {
    return new Promise((resolve, reject) => {
        Shift
            .remove({ _id: id })
            .exec()
            .then(result => {
                const removed_count = result.n;
                if (removed_count === 0) {
                    reject({ status: 404, error: 'No id found' });
                }
                else {
                    resolve({ status: 200, message: 'sucees' });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    })
}



/*
    * This process will take some time. 
*/
const check_email = (email) => {
    return new Promise((resolve, reject) => {
        emailExistence.check(email, function (err, result) {
            if (err) {
                reject({ status: 500, error: 'Check Email error' });
            }
            if (result) {

                resolve();
            }
            else {
                reject({ status: 404, error: 'Invalid email' });
            }
        });
    });
}


exports.send_email = (body) => {
    return new Promise((resolve, reject) => {
        check_email(body.to)
            .then(() => {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.SYSTEM_EMAIL,
                        pass: process.env.SYSTEM_PASS
                    }
                });

                let mailOptions = {
                    from: process.env.SYSTEM_EMAIL,
                    to: body.to,
                    subject: body.subject,
                    text: `Dear sir/madam, \n\nMr. ${body.senderName} has sent you a request to approve the shift on ${body.shiftDate}. \n\n Thank you. \n Best regards \n ${body.senderName}`
                }

                transporter
                    .sendMail(mailOptions)
                    .then(() => {
                        resolve({ status: 200, message: 'Email is sent' });
                    })
                    .catch(err => {
                        reject({ status: 500, error: err });
                    });
            })
            .catch(err => {
                reject({ status: err.status, error: err.error });
            });
    });
}