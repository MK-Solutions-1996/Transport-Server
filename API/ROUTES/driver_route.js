const express = require('express');
const router = express.Router();
const checkAPI = require('../MIDDLEWARES/checkAPI');
const driverController = require('../CONTROLLERS/driver_con');

/*
    * Save driver 
*/
router.post('/', checkAPI, (req, res, next) => {
    const body = req.body;
    driverController
        .save_driver(body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/*
    * Get all drivers 
*/
router.get('/', checkAPI, (req, res, next) => {
    driverController
        .find_drivers()
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/*
    * Get driver by ID 
*/
router.get('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    driverController
        .find_driver_by_id(id)
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/*
    * Update Driver 
*/
router.patch('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    driverController
        .update_driver(id, body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/*
    * Remove Driver 
*/

router.delete('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    driverController
        .remove_driver(id)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
})

module.exports = router;