const express = require('express');
const router = express.Router();


const test_route = require('./ROUTES/test_route');
const user_route = require('./ROUTES/user_route');
const admin_route = require('./ROUTES/admin_route');
const employee_route = require('./ROUTES/employee_route');
const driver_route = require('./ROUTES/driver_route');


router.use('/test', test_route);
router.use('/user', user_route);
router.use('/admin', admin_route);
router.use('/employee', employee_route);
router.use('/driver', driver_route);


module.exports = router;