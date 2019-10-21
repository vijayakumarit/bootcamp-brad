const express = require('express');
const dotenv = require('dotenv')

const bootscamp = require('./routes/bootcamps')

dotenv.config({path:'./config/config.env'});

const app = express();

app.use('/api/v1/bootcamps',bootscamp)

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} `)
})
