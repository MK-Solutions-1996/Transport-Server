const mongoose = require('mongoose');
const City = require('../MODELS/city_mod');

exports.save_city = (body) => {
    return new Promise((resolve, reject) => {
        const city = new City({
            _id: mongoose.Types.ObjectId(),
            cityName: body.cityName,
            km: body.km,
            mainZone: body.mainZone,
            subZones: body.subZones
        });
        city
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


exports.find_cities = () => {
    return new Promise((resolve, reject) => {
        City
            .find()
            .select('_id cityName km mainZone subZones')
            .exec()
            .then(result => {
                if (result.length === 0) {
                    reject({ status: 404, error: 'No data found' });
                }
                else {
                    resolve({ status: 200, data: result });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            })
    });
}


exports.find_city_by_id = (id) => {
    return new Promise((resolve, reject) => {
        City
            .findById(id)
            .select('_id cityName km mainZone subZones')
            .exec()
            .then(result => {
                if (result) {
                    resolve({ status: 200, data: result });
                }
                else {
                    reject({ status: 404, error: 'No data found' });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            })
    });
}


exports.update_city = (id, body) => {
    return new Promise((resolve, reject) => {
        const update_operation = {};

        for (const operations of body) {
            update_operation[operations.key] = operations.value;
        }

        City
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


exports.remove_city = (id) => {
    return new Promise((resolve, reject) => {
        City
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
            });
    })
}