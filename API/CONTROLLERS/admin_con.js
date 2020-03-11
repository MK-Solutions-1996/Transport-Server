const mongoose = require('mongoose');
const Admin = require('../MODELS/admin_mod');


exports.save_admin = (hash, body) => {
    return new Promise((resolve, reject) => {
        const adminData = new Admin({
            _id: new mongoose.Types.ObjectId(),
            firstName: body.firstName,
            empNo: body.empNo,
            email: body.email,
            type: body.type,
            username: 'admin',
            password: hash
        });

        adminData.save()
            .then(() => {
                resolve({ message: 'success' });
            })
            .catch(err => {
                const e = err.errors;
                if (e.empNo || e.email || e.type || e.username || e.password) {
                    reject({ status: 422, error: e });
                }
                else {
                    reject({ status: 500, error: err });
                }
            });
    });
}

exports.find_admin = (username) => {
    return new Promise((resolve, reject) => {
        Admin.find({ username: username })
            .exec()
            .then(admin => {
                if (admin) {
                    resolve(admin);
                }
                else {
                    reject({ status: 401, error: 'Admin not exist' });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    })
}


exports.find_admin_by_id = (id) => {
    return new Promise((resolve, reject) => {
        Admin.
            findById(id)
            .exec()
            .then(admin => {
                if (admin) {
                    resolve(admin); // this would be object.
                }
                else {
                    reject({ status: 404, error: 'No id found' });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            })
    })
}


exports.update_admin_password = (id, new_password) => {
    return new Promise((resolve, reject) => {
        const update_operation = { password: new_password };
        Admin
            .updateOne({ _id: id }, { $set: update_operation })
            .exec()
            .then((result) => {
                const updated_count = result.n;
                if (updated_count === 0) {
                    reject({ status: 404, error: 'No id found' });
                }
                resolve({ status: 201, message: 'sucess' });
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    });
}

//this body wolud be an array
exports.update_admin_profile = (id, body) => {
    return new Promise((resolve, reject) => {
        const update_operation = {};

        for (const operations of body) {
            update_operation[operations.key] = operations.value;
        }

        //can't update the password or id
        if (update_operation.password || update_operation._id || update_operation.username) {
            reject({ status: 403, error: 'Invalid attempt' });
        }
        else {
            Admin
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