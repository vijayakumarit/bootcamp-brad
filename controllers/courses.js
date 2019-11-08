const ErrorResponse = require ('../utils/errorResponse')
const asyncMiddleware = require('../middleware/async')
const Course = require ('../models/Course')



//Desc Get all bootcamps
//Method GET /api/v1/courses
//Method GET /api/v1/bootcams/:bootcampId/courses

exports.getCourses = asyncMiddleware(async (req,res,next)=>{

    let query;

    if(req.params.bootcampId){

        query = Course.find({bootcamp :req.params.bootcampId});

    }
    else {
        query = Course.find().populate({
            path : 'bootcamp',
            select:'name description'
        });
    }

    const courses = await query;
    
    res.status(200).json({
        success:true,
        count : courses.length,
        data : courses
    })

});