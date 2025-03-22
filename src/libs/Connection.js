const mongoose = require('mongoose');
require('dotenv').config()

const Connection = () => {
    mongoose.connect(process.env.MONGO_URI).then((data)=>{
        console.log('successfully connected with database', data.connection.host);
    }).catch(err=>{
        console.log('failed to connect with the database: ', err);
    })
}

module.exports = Connection