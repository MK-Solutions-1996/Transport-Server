const mongoose = require('mongoose');
const DriverAttendence = require('../MODELS/driver_attendence_mod');


exports.save_driver_attendence = (body) => {
    return new Promise((resolve, reject) => {
        const details = body.details;
        var duplicates = check_local_duplicates(details);
        if (duplicates.length === 0) {
            const driverAttendence = new DriverAttendence({
                _id: mongoose.Types.ObjectId(),
                date: body.date,
                details: body.details
            });
            driverAttendence
                .save()
                .then(() => {
                    resolve({ status: 201, message: 'New driver record(s) saved' });
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
        }
        else {
            reject({ status: 422, error: { message: 'Duplicate driver records', ids: duplicates } });
        }
    });
}



exports.find_driver_attendence = () => {
    return new Promise((resolve, reject) => {
        DriverAttendence
            .find()
            .select('_id date details')
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
            });
    });
}



exports.find_driver_attendence_by_id = (id) => {
    return new Promise((resolve, reject) => {
        DriverAttendence
            .findById({ _id: id })
            .select('_id date details')
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
            });
    });
}


exports.find_driver_attendence_by_date = (date) => {
    return new Promise((resolve, reject) => {
        DriverAttendence
            .find({ date: date })
            .select('_id date details')
            .exec()
            .then(result => {
                if (result.length === 0) {
                    reject({ status: 404, error: 'No data found' });
                }
                resolve({ status: 200, data: result[0] });
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    });
}




/*
    1. check wheather the details(localDetails) array has the duplicates 
    2. check whether the database has the same details(localDetail) records.
    
    The nonDuplicate records(objects) will be added as new records to the database, mean while
    duplicates will be updated the availability object.
*/
exports.update_operation = (recordId, localDetails, dbDetails) => {
    return new Promise((resolve, reject) => {
        var localDuplicates = check_local_duplicates(localDetails); // returns duplicates of localDetails
        var dbDuplicates = check_database_duplicates(localDetails, dbDetails); // returns array including local & database duplicates
        var duplicates = dbDuplicates[0].duplicates;
        var nonDuplicates = dbDuplicates[0].nonDuplicates;

        if (localDuplicates.length === 0) {
            update_driver_attendence(recordId, nonDuplicates)
                .then(result => {
                    update_driver_attendence_availability(recordId, duplicates)
                        .then(av_result => {
                            resolve({ status: 201, message: [result.message, av_result.message] });
                        })
                        .catch(av_err => {
                            reject({ status: av_err.status, error: av_err.error });
                        });
                })
                .catch(err => {
                    reject({ status: err.status, error: err.error });
                })
        }
        else {
            reject({ status: 422, error: { message: 'Duplicate drivers', ids: localDuplicates } });
        }
    });
}



/*
    *update the details attribute(array) by non duplicate data array.
     (a new object are pushed to the database)
*/
const update_driver_attendence = (recordId, nonDuplicates) => {
    return new Promise((resolve, reject) => {
        if (nonDuplicates.length > 0) {
            DriverAttendence
                .update({ _id: recordId }, { $push: { details: nonDuplicates } }, { runValidators: true, context: 'query' })
                .exec()
                .then((result) => {
                    const updated_count = result.n;
                    if (updated_count === 0) {
                        reject({ status: 404, error: 'No date found' });
                    }
                    else {
                        resolve({ status: 201, message: `${nonDuplicates.length} of records are added` }); // success
                    }
                })
                .catch(err => {
                    const e = err.errors;
                    if (e) {
                        reject({ status: 422, error: e });
                    }
                    else {
                        reject({ status: 500, error: error });
                    }
                });
        }
        else {
            resolve({ status: 200, message: 'No new drivers to be added' });
        }
    });
}

/*
    *update the availability attribute in the details array.
*/
const update_driver_attendence_availability = (recordId, duplicates) => {
    return new Promise(async (resolve, reject) => {
        if (duplicates.length > 0) {
            var updated_count = 0;
            var failure_count = 0;
            for (var i = 0; i < duplicates.length; i++) {
                await DriverAttendence
                    .update({ _id: recordId, 'details.driverId': duplicates[i].driverId }, { $set: { 'details.$.availability': duplicates[i].availability } })
                    .exec()
                    .then(() => {
                        updated_count = updated_count + 1;
                    })
                    .catch(() => {
                        failure_count = failure_count + 1;
                    });
            }
            if (updated_count === duplicates.length) {
                resolve({ status: 201, message: `${updated_count} of availabilities are updated` });
            }
            else {
                reject({ status: 500, error: 'Availability update error' });
            }
        }
        else {
            resolve({ status: 200, message: 'No availaility updates to be done' });
        }
    });
}





/* 
    * localDetails = data comming from client
    * dbDetails = data already exists in the database
    
    * This functions returns the duplicates and non duplicates
      as a array object including two seperate arrays (duplicates & nonDuplicates) 
*/
const check_database_duplicates = (localDetails, dbDetails) => {
    var duplicates = [];
    var nonDuplicates = [];
    for (var i = 0; i < localDetails.length; i++) {
        var temp = false;
        for (var j = 0; j < dbDetails.length; j++) {
            if (localDetails[i].driverId === dbDetails[j].driverId) {
                temp = true;
            }
        }
        if (temp) {
            duplicates.push(localDetails[i]);
        }
        else {
            nonDuplicates.push(localDetails[i]);
        }
    }
    return [{ duplicates, nonDuplicates }];
}


/*
    * If the details(driver attendence dateils attribute) array has any duplicate ids itself,
      this function will returns an array of duplicates.   
*/
const check_local_duplicates = (details) => {
    const duplicates = [];
    const n = details.length;
    for (var i = 0; i < n - 1; i++) {
        for (var j = i + 1; j < n; j++) {
            if (details[i].driverId === details[j].driverId) {
                duplicates.push(details[i].driverId);
            }
        }
    }
    return duplicates;
}





exports.remove_driver_attendence = (id) => {
    return new Promise((resolve, reject) => {
        DriverAttendence
            .remove({ _id: id })
            .then(result => {
                if (result.n === 0) {
                    reject({ status: 404, error: 'No records removed' });
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

exports.remove_driver_attendence_details = (recordId, driverId) => {
    return new Promise((resolve, reject) => {
        DriverAttendence
            .update({ _id: recordId }, { "$pull": { "details": { "driverId": driverId } } }, { safe: true, multi: true })
            .exec()
            .then(result => {
                if (result.n === 0) {
                    reject({ status: 404, error: 'No id found' });
                }
                else if (result.nModified === 0) {
                    reject({ status: 404, error: 'No driverId found' });
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

