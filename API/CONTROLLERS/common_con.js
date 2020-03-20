const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.hash_password = (password) => {
    return new Promise((resolve, reject) => {
        /*
            * If password is empty it will be passed without bcrypt, then it will be cought on validation process 
         */
        if (password.length === 0) {
            resolve(password);

        }
        else if (password.length < 8) {
            resolve(password);
        }

        else {
            bcrypt
                .hash(password, 10)
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject({ status: 500, error: err });
                });
        }
    });
}

/*
    *Current password and the hashed password is checked here.
*/
exports.compare_passwords = (password, hash_password) => {
    return new Promise((resolve, reject) => {
        bcrypt
            .compare(password, hash_password)
            .then(result => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject({ status: 401, error: 'Invalid' });
                }
            })
            .catch(err => {
                reject({ status: 500, error: err });
            });
    });
}


/*
    * A new token will be generated here, which will be expired in one hour.
*/
exports.generate_token = (object) => {
    var token = jwt.sign(object, 'secret',
        {
            expiresIn: '1h' //expiresIn: 60 * 60
        });

    return token;
}



