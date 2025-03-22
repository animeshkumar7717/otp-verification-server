const express = require('express');
const cors = require('cors');
const Connection = require('./src/libs/Connection');
const configuration = require('./src/config/configuration');
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors());

Connection();

app.get('/', (req,res)=>{
    console.log('just check')
    res.send('App is working!!!!!')
})

app.use("/api/auth", require("./src/routes/authRoutes"));

const PORT = configuration.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
