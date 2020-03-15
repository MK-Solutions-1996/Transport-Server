const mongoose = require('mongoose');
const Zone = require('../MODELS/zone_mod');

exports.save_zone = (body) => {
    return new Promise((resolve, reject) => {
        const zone = new Zone({
            _id: mongoose.Types.ObjectId(),
            mainZone: body.mainZone
        });
        zone
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


exports.find_zones = () => {
    return new Promise((resolve, reject) => {
        Zone
            .find()
            .select('_id mainZone')
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


exports.find_zone_by_id = (id) => {
    return new Promise((resolve, reject) => {
        Zone
            .findById(id)
            .select('_id mainZone')
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


exports.update_zone = (id, body) => {
    return new Promise((resolve, reject) => {
        const update_operation = {};

        for (const operations of body) {
            update_operation[operations.key] = operations.value;
        }

        Zone
            .updateOne({ _id: id }, { $set: update_operation }, { runValidators: true, context: 'query' })
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


exports.remove_zone = (id) => {
    return new Promise((resolve, reject) => {
        Zone
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