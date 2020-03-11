const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Test = require('../MODELS/test_mod');

router.get('/', (req, res, next) => {
    Test.find()
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.status(200).json(data);
            }
            else {
                res.status(404).json({
                    message: 'No data found'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
    const testData = new Test({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });

    testData.save()
        .then(() => {
            res.status(200).json({
                message: 'Test post',
                data: testData
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});


router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Test.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})

module.exports = router;