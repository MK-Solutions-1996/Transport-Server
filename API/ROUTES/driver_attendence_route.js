const express = require('express');
const router = express.Router();
const checkAPI = require('../MIDDLEWARES/checkAPI');
const driverAttendenceController = require('../CONTROLLERS/driver_attendence_con');


/*
    * According to the situation, driver attendence shoul be save, if they are not exist 
      accourding to the particular date. If the record is exist, It should be updated accordingly. 
*/
router.post('/', checkAPI, (req, res, next) => {
    const body = req.body;
    const date = req.body.date;

    driverAttendenceController
        .find_driver_attendence_by_date(date)
        .then(result => {
            const data = result.data;
            if (data) {
                const id = data._id;
                const details = body.details;

                driverAttendenceController
                    .update_operation(id, details, data.details)
                    .then(result => {
                        res.status(result.status).json({ message: result.message });
                    })
                    .catch(err => {
                        res.status(err.status).json({ error: err.error });
                    });
            }
            else {
                driverAttendenceController
                    .save_driver_attendence(body)
                    .then(result => {
                        res.status(result.status).json({ message: result.message });
                    })
                    .catch(err => {
                        res.status(err.status).json({ error: err.error });
                    });
            }
        })
        .catch(err => {
            res.status(err.status).json({ err: error });
        });
});



router.get('/', checkAPI, (req, res, next) => {
    driverAttendenceController
        .find_driver_attendence()
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});



/*
    * Get driver attendence by id 
*/
router.get('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    driverAttendenceController
        .find_driver_attendence_by_id(id)
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});


/*
    * Get driver attendence by date 
*/
router.get('/date/:date', checkAPI, (req, res, next) => {
    const date = req.params.date;
    driverAttendenceController
        .find_driver_attendence_by_date(date)
        .then(result => {
            res.status(result.status).json({ data: result.data });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});





/*
    * Remove driver attendence by Id
*/
router.delete('/:id', checkAPI, (req, res, next) => {
    const id = req.params.id;
    driverAttendenceController
        .remove_driver_attendence(id)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});




/*
    * Remove objects of details array by driverId 
*/
router.patch('/', checkAPI, (req, res, next) => {

    const recordId = req.body.id;
    const driverId = req.body.driverId;
    driverAttendenceController
        .remove_driver_attendence_details(recordId, driverId)
        .then(result => {
            res.status(result.status).json({ message: result.message });
        })
        .catch(err => {
            res.status(err.status).json({ error: err.error });
        });
});





module.exports = router;