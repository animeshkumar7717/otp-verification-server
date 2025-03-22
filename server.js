const express = require('express');
const cors = require('cors');
const Connection = require('./src/libs/Connection');
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors());

Connection();

app.get('/', (req,res)=>{
    res.send('App is working...')
})

app.use("/api/auth", require("./src/routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
