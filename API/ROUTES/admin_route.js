const express = require('express');
const router = express.Router();
const commonController = require('../CONTROLLERS/common_con');
const adminController = require('../CONTROLLERS/admin_con');
const checkAuth = require('../MIDDLEWARES/checkAuth');
const checkAPI = require('../MIDDLEWARES/checkAPI');


/* 
    * Hash the password and save the admin
*/
router.post('/', checkAPI, (req, res, next) => {
    adminController
        .save_admin(req.body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/* 
    * Update the admin profile details along with the ID.
    * Here password cannto be changed.
*/
router.patch('/profile/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    const body = req.body; // req.body = [{key = <key> , value = <value>} ]
    adminController
        .update_admin_profile(id, body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/* 
    * Update the admin's password by checking existing password.
*/
router.patch('/password', checkAPI, (req, res, next) => {

    const id = req.body.id;
    const current_password = req.body.password;
    const new_password = req.body.newPassword;

    adminController
        .find_admin_by_id(id)
        .then(admin => {
            commonController.compare_passwords(current_password, admin.password)
                .then(result => {
                    if (result) {
                        adminController
                            .update_admin_password(id, new_password)
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

module.exports = router;