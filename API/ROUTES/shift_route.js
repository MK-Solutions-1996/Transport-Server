const express = require('express');
const router = express.Router();
const shiftController = require('../CONTROLLERS/shift_con');
const checkAPI = require('../MIDDLEWARES/checkAPI');
const commonController = require('../CONTROLLERS/common_con');

router.post('/', checkAPI, (req, res, next) => {
    const body = req.body;
    shiftController
        .save_shift(body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});

router.get('/', checkAPI, (req, res, next) => {
    shiftController
        .find_shifts()
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});

router.get('/:shiftDate', checkAPI, (req, res, next) => {
    const shiftDate = req.params.shiftDate;
    shiftController
        .find_shift_by_shift_date(shiftDate)
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


router.patch('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    shiftController
        .update_shift(id, body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


router.patch('/approve/', checkAPI, (req, res, next) => {
    const body = req.body;
    shiftController
        .update_shift_approve(body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


router.delete('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    shiftController
        .remove_shift(id)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


router.post('/email', checkAPI, (req, res, next) => {
    const body = req.body;
    shiftController
        .send_email(body)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});





module.exports = router;