const Driver = require('../MODELS/driver_mod');
const mongoose = require('mongoose');

exports.save_driver = (body) => {
    return new Promise((resolve, reject) => {
        const driver = new Driver({
            _id: mongoose.Types.ObjectId(),
            driverName: body.driverName,
            driverMobile: body.driverMobile,
            driverNic: body.driverNic,
            driverLicenNo: body.driverLicenNo,
            driverLicenExp: body.driverLicenExp,
            ownerName: body.ownerName,
            ownerMobile: body.ownerMobile,
            vehicleNo: body.vehicleNo,
            vehicleCategory: body.vehicleCategory,
            vehicleCapacity: body.vehicleCapacity,
            vehicleType: body.vehicleType
        });
        driver
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

exports.find_drivers = () => {
    return new Promise((resolve, reject) => {
        Driver
            .find()
            .select('driverName driverMobile driverNic driverLicenNo driverLicenExp ownerName ownerMobile vehicleNo vehicleCategory vehicleCapacity vehicleType')
            .exec()
            .then(result => {
                if (result.length === 0) {
                    reject({ status: 404, error: "No data found" });
                }
                resolve({ status: 200, data: result }); // result would be an array
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    })
}

exports.find_driver_by_id = (id) => {
    return new Promise((resolve, reject) => {
        Driver
            .findById(id)
            .select('driverName driverMobile driverNic driverLicenNo driverLicenExp ownerName ownerMobile vehicleNo vehicleCategory vehicleCapacity vehicleType')
            .exec()
            .then(result => {
                console.log(result);
                if (result) {
                    resolve({ status: 200, data: result }) // result would be an object
                }
                else {
                    reject({ status: 404, error: "No data found" });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    });
}


exports.update_driver = (id, body) => {
    return new Promise((resolve, reject) => {
        const update_operation = {};

        for (const operations of body) {
            update_operation[operations.key] = operations.value;
        }


        Driver
            .update({ _id: id }, { $set: update_operation }, { runValidators: true, context: 'query' })
            .exec()
            .then(result => {
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
                if (e) {
                    reject({ status: 422, error: e });
                }
                else {
                    reject({ status: 500, error: err });
                }
            });
    });
}


exports.remove_driver = (id) => {
    return new Promise((resolve, reject) => {
        Driver
            .remove({ _id: id })
            .exec()
            .then(result => {
                const deleted_count = result.n;
                if (deleted_count === 0) {
                    reject({ status: 404, error: 'No id found' });
                }
                else {
                    resolve({ status: 200, message: 'success' });
                }

            })
            .catch(err => {
                reject({ status: 500, error: err });
            })
    })
}
