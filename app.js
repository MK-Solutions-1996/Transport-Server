const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./API/router');




const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use(morgan('dev'));


dotenv.config(); // configure the .env file
mongoose.connect(
    'mongodb+srv://mksolution:' + process.env.MONGO_ATLAS_PW + '@cluster0-moiar.mongodb.net/test?retryWrites=true&w=majority',
    {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true
    },
    (err) => {
        if (err) {
            console.log('***Database is not connected***' + err);
        }
        else {
            console.log('***Database is connected***');
            console.log('');
        }
    }
);


app.use('/', router);

app.listen(4000, () => {
    console.log("***Server listenning to port 4000***");
});

