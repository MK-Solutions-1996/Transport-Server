const express = require('express');
const router = express.Router();
const userController = require('../CONTROLLERS/user_con');
const commonController = require('../CONTROLLERS/common_con');
const adminController = require('../CONTROLLERS/admin_con');
const checkAuth = require('../MIDDLEWARES/checkAuth');
const checkAPI = require('../MIDDLEWARES/checkAPI');

/*
    Hash the password and save the user
*/
router.post('/signup', checkAPI, (req, res, next) => {
    userController
        .save_user(req.body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
})




/*
    *check username equals to the 'admin' If so, check the passwords and 
     log as admin with generating a token.
    *Otherwise log as user with generating a token.
    *The token will be expired in an hour.
*/
router.post('/login', checkAPI, (req, res, next) => {

    if (req.body.username === "Admin" || req.body.username === "admin") {
        adminController
            .find_admin(req.body.username)
            .then(admin => {
                commonController
                    .compare_passwords(req.body.password, admin[0].password)
                    .then(result => {
                        if (result) {
                            var object = {
                                userId: admin[0]._id,
                                username: admin[0].username
                            }
                            var token = commonController.generate_token(object);
                            res.status(200).json({
                                message: 'success',
                                userData: {
                                    id: admin[0]._id,
                                    name: admin[0].firstName,
                                    email: admin[0].email,
                                    type: admin[0].type
                                },
                                logType: 'admin',
                                token: token
                            });
                        }
                    })
                    .catch(err => {
                        res.status(err.status).json({ error: err.error });
                    });
            })
            .catch(err => {
                res.status(err.status).json({ error: err.error });
            });

    }
    else {
        userController
            .find_user(req.body.username)
            .then(user => {
                console.log(user[0].password);
                commonController
                    .compare_passwords(req.body.password, user[0].password)
                    .then(result => {
                        if (result) {
                            var object = {
                                userId: user[0]._id,
                                username: user[0].email
                            }
                            var token = commonController.generate_token(object);
                            res.status(200).json({
                                message: 'success',
                                userData: {
                                    id: user[0]._id,
                                    name: user[0].firstName,
                                    email: user[0].email,
                                    type: user[0].type
                                },
                                logType: 'user',
                                token: token
                            });

                        }
                    })
                    .catch(err => {
                        res.status(err.status).json({ error: err.error });
                    });
            })
            .catch(err => {
                res.status(err.status).json({ error: err.error });
            });
    }
});


/* 
    * Get all the users (without admin)
*/
router.get('/', checkAPI, (req, res, next) => {
    userController
        .find_all_users()
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/* 
    * Update the user profile details along with the ID.
    * Here password cannto be changed.
*/
router.patch('/profile/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    userController
        .update_user_profile(id, req.body) // req.body = [{key = <key> , value = <value>} ]
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});



/* 
    * Update the user's password by checking existing password.
*/
router.patch('/password', checkAPI, (req, res, next) => {

    const id = req.body.id;
    const current_password = req.body.password;
    const new_password = req.body.newPassword;

    userController
        .find_user_by_id(id)
        .then(user => {
            commonController.compare_passwords(current_password, user.password)
                .then(result => {
                    if (result) {
                        userController
                            .update_user_password(id, new_password)
                            .then(result => {
                                res.status(result.status).json({ message: result.message });
                            })
                            .catch(err => {
                                res.status(err.status).json({ error: err.error });
                            });
                    }
                })
                .catch(err => {
                    res.status(err.status).json({ error: err.error });
                });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/* 
    * Delete a user by ID.
*/
router.delete('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    userController
        .remove_user(id)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


module.exports = router;