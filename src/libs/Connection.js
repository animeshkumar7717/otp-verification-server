const mongoose = require('mongoose');
const configuration = require('../config/configuration');
require('dotenv').config()

const Connection = () => {
    mongoose.connect(configuration.mongoUri).then((data)=>{
        console.log('successfully connected with database', data.connection.host);
    }).catch(err=>{
        console.log('failed to connect with the database: ', err);
    })
}

module.exports = Connection