const express = require('express');
const router = express.Router();


const test_route = require('./ROUTES/test_route');
const user_route = require('./ROUTES/user_route');
const admin_route = require('./ROUTES/admin_route');
const employee_route = require('./ROUTES/employee_route');
const driver_route = require('./ROUTES/driver_route');
const zone_route = require('./ROUTES/zone_route');
const city_route = require('./ROUTES/city_route');
const driver_attendence_route = require('./ROUTES/driver_attendence_route');
const shift_route = require('./ROUTES/shift_route');


router.use('/test', test_route);
router.use('/user', user_route);
router.use('/admin', admin_route);
router.use('/employee', employee_route);
router.use('/driver', driver_route);
router.use('/zone', zone_route);
router.use('/city', city_route);
router.use('/driver_attendance', driver_attendence_route);
router.use('/shift', shift_route);


module.exports = router;