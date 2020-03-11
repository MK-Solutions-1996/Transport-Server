const express = require('express');
const router = express.Router();
const employee_controller = require('../CONTROLLERS/employee_con');
const checkAuth = require('../MIDDLEWARES/checkAuth');
const checkAPI = require('../MIDDLEWARES/checkAPI');


/*
    * Save employee 
*/
router.post('/', checkAPI, (req, res, next) => {
    employee_controller
        .save_employee(req.body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/*
    * Get all the employees 
*/
router.get('/', checkAPI, (req, res, next) => {
    employee_controller
        .find_all_employees()
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/*
    * Get employee by ID
*/
router.get('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    employee_controller
        .find_employee_by_id(id)
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});



/*
    * Update employee by Id
*/
router.patch('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    employee_controller
        .update_employee(id, body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});




router.delete('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    employee_controller
        .remove_employee(id)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


module.exports = router;