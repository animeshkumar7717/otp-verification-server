require('dotenv').config();

const configuration = {
    PORT : process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/otp-verification' 
}

module.exports = configuration;
