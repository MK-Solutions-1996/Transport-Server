const express = require('express');
const router = express.Router();
const checkAPI = require('../MIDDLEWARES/checkAPI');
const zoneController = require('../CONTROLLERS/zone_con');

/*
    * Save zone 
*/
router.post('/', checkAPI, (req, res, next) => {
    const body = req.body;
    zoneController
        .save_zone(body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/*
    * Get all zones
*/
router.get('/', checkAPI, (req, res, next) => {
    zoneController
        .find_zones()
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/*
    * Get zone by ID 
*/
router.get('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    zoneController
        .find_zone_by_id(id)
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/*
    * Update Zone 
*/
router.patch('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    zoneController
        .update_zone(id, body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/*
    * Remove zone 
*/

router.delete('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    zoneController
        .remove_zone(id)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
})

module.exports = router;