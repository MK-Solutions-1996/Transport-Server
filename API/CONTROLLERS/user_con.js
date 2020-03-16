const mongoose = require('mongoose');
const User = require('../MODELS/user_mod');
const bcrypt = require('bcryptjs');


exports.save_user = (body) => {
    return new Promise((resolve, reject) => {
        const userData = new User({
            _id: new mongoose.Types.ObjectId(),
            empNo: body.empNo,
            firstName: body.firstName,
            type: body.type,
            email: body.email,
        });

        userData.confirm_password_operation(body.password, body.confirmPassword);
        userData.save()
            .then(() => {
                resolve({ status: 201, message: 'success' });
            })
            .catch(err => {
                const e = err.errors;
                if (e.empNo || e.email || e.type || e.password) {
                    reject({ status: 422, error: e });
                }
                else {
                    reject({ status: 400, error: err });
                }
            });
    });
}




exports.find_all_users = () => {
    return new Promise((resolve, reject) => {
        User.find()
            .select('_id empNo firstName type email')
            .exec()
            .then(users => {
                if (users.length === 0) {
                    reject({ status: 404, error: 'No users found' });
                }
                else {
                    resolve({ status: 200, data: users });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    });
}

exports.find_user = (username) => {
    return new Promise((resolve, reject) => {
        User.find({ empNo: username })
            .exec()
            .then(user => {
                if (user.length < 1) {
                    reject({ status: 401, error: 'Invalid username' });
                }
                resolve(user);
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    })
}

exports.update_user_profile = (id, body) => {
    return new Promise((resolve, reject) => {
        const update_operation = {};

        for (const operations of body) {
            update_operation[operations.key] = operations.value;
        }

        //can't update the password or id
        if (update_operation.password || update_operation._id) {
            reject({ status: 403, error: 'Invalid attempt' });
        }
        else {
            User
                .update({ _id: id }, { $set: update_operation }, { runValidators: true, context: 'query' }) // validations will be worked.
                .exec()
                .then((result) => {
                    const updated_count = result.n;
                    if (updated_count === 0) {
                        reject({ status: 404, error: 'No id found' });
                    }
                    else {
                        resolve({ status: 201, message: 'success' });
                    }
                })
                .catch(err => {
                    const e = err.errors;
                    if (e.empNo || e.email || e.firstName || e.type) {
                        reject({ status: 422, error: e });
                    }
                    else {
                        reject({ status: 500, error: err });
                    }
                });
        }
    });
}


exports.find_user_by_id = (id) => {
    return new Promise((resolve, reject) => {
        User.
            findById(id)
            .exec()
            .then(user => {
                if (user) {
                    resolve(user); // this would be object.
                }
                else {
                    reject({ status: 404, error: 'No id found' });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    })
}






exports.update_user_password = (id, new_password) => {
    return new Promise((resolve, reject) => {
        if (new_password === "") {
            reject({ status: 422, error: { newPassword: { message: 'Required' } } });
        }
        else if (new_password.length < 8) {
            reject({ status: 422, error: { newPassword: { message: '8 characters required' } } });
        }
        else {

            bcrypt
                .hash(new_password, 10)
                .then(hash => {
                    const update_operation = { password: hash };
                    User
                        .updateOne({ _id: id }, { $set: update_operation }, { runValidators: true, context: 'query' })
                        .exec()
                        .then((result) => {
                            const updated_count = result.n;
                            if (updated_count === 0) {
                                reject({ status: 404, error: 'No id found' });
                            }
                            else {
                                resolve({ status: 201, message: 'sucess' });
                            }
                        })
                        .catch(err => {
                            reject({ status: 500, error: err.error });
                        });
                })
                .catch((err) => {
                    reject({ status: 422, error: err });
                });
        }
    });
}



exports.remove_user = (id) => {
    return new Promise((resolve, reject) => {
        User.remove({ _id: id })
            .exec()
            .then((result) => {
                const removedCount = result.n;
                if (removedCount === 0) {
                    reject({ status: 404, error: 'User not found' });
                }
                else {
                    resolve({ status: 200, message: 'success' });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    });
}







