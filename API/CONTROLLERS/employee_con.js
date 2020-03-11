const monggoose = require('mongoose');
const Employee = require('../MODELS/employee_mod');

exports.save_employee = (body) => {
    return new Promise((resolve, reject) => {
        const employee = new Employee({
            _id: monggoose.Types.ObjectId(),
            empNo: body.empNo,
            name: body.name,
            address: body.address,
            city: body.city,
            department: body.department,
            nic: body.nic,
            mobile: body.mobile,
            bus: body.bus
        });
        employee
            .save()
            .then(() => {
                resolve({ status: 201, message: 'success' });
            })
            .catch(err => {
                const e = err.errors;
                if (e.empNo || e.name || e.address || e.city || e.department || e.nic || e.mobile || e.bus) {
                    reject({ status: 422, error: e });
                }
                else {
                    reject({ status: 500, error: err });
                }
            });
    });
}

exports.find_all_employees = () => {
    return new Promise((resolve, reject) => {
        Employee
            .find()
            .select('_id empNo name address city department nic mobile bus') // filter the result (removing the '_v from the result')
            .then(data => {
                if (data.length === 0) {
                    reject({ status: 404, error: 'No data found' });
                }
                resolve({ status: 200, data: data }); // this would be an array
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    });
}

exports.find_employee_by_id = (id) => {
    return new Promise((resolve, reject) => {
        Employee
            .findById(id)
            .select('_id empNo name address city department nic mobile bus') // filter the result (removing the '_v from the result')
            .then(result => {
                if (result) {
                    resolve({ status: 200, data: result }); // this would be as object
                }
                else {
                    reject({ status: 404, error: 'No data found' });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    });
}


exports.update_employee = (id, body) => {
    return new Promise((resolve, reject) => {
        const update_operation = {};
        for (const operations of body) {
            update_operation[operations.key] = operations.value;
        }

        Employee
            .update({ _id: id }, { $set: update_operation }, { runValidators: true, context: 'query' })
            .exec()
            .then((result) => {
                const update_count = result.n;
                if (update_count === 0) {
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
            })
    })
}



exports.remove_employee = (id) => {
    return new Promise((resolve, reject) => {
        Employee.remove({ _id: id })
            .exec()
            .then((result) => {
                const removed_count = result.n;
                if (removed_count === 0) {
                    reject({ status: 404, error: 'No id found' });
                }
                else {
                    resolve({ status: 201, message: 'success' });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    });
} 