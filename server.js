const express = require('express');
const dotenv = require('dotenv')
const connectdb = require('./config/db')
const errorHandler = require ('./middleware/error')
const morgan = require('morgan')
const colors = require('colors')

dotenv.config({path:'./config/config.env'});

//connect database cluster
connectdb();
const bootscamp = require('./routes/bootcamps')

const courses = require('./routes/courses')
const app = express();

 //Body Parser
 app.use(express.json())



//middleare morgan
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}

app.use('/api/v1/bootcamps',bootscamp)
app.use('/api/v1/courses',courses)

app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} `.yellow.bold)
})
