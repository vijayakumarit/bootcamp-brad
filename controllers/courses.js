const ErrorResponse = require ('../utils/errorResponse')
const asyncMiddleware = require('../middleware/async')
const Course = require ('../models/Course')
const Bootcamp = require ('../models/Bootcamp')



//Desc Get all bootcamps
//Method GET /api/v1/courses
//Method GET /api/v1/courses/:bootcampId/courses

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

//Desc Get Bootcamp based on id
//Method GET /api/v1/courses/:id

exports.getCourse = asyncMiddleware(async (req,res,next)=>{

  const course = await Course.findById(req.params.id).populate({

    path:'bootcamp',
    select : 'name description'
  });

  if(!course){
    return  next (
        new ErrorResponse(`Course not found ${req.params.id}`,404));
}

    
    res.status(200).json({
        success:true,
        data : course
    })

});


//Desc Create a new course
//Method GET /api/v1/bootcamps/:bootcampId/courses

exports.addCourse = asyncMiddleware(async (req,res,next)=>{

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
  
    if(!bootcamp){
      return  next (
          new ErrorResponse(`No bootcamp id in ${req.params.id}`,404));
  }
  
  if(bootcamp.user.toString() !== req.user.id && req.user.role !=='admin'){
    return  next (
        new ErrorResponse(`User ${req.user.id} not authorized for Create a Courses `,401));
}


  const course = await Course.create(req.body)
      
      res.status(200).json({
          success:true,
          data : course
      })
  
  });

  //Desc Update a course
//Method PUT /api/v1/courses/:id

exports.updateCourse = asyncMiddleware(async (req,res,next)=>{


    let course = await Course.findById(req.params.id)
  
    if(!course){
      return  next (
          new ErrorResponse(`No course id in ${req.params.id}`,404));
  }
  

  if(course.user.toString() !== req.user.id && req.user.role !=='admin'){
    return  next (
        new ErrorResponse(`User ${req.params.id} not authorized for update a Courses `,401));
}


   course = await Course.findByIdAndUpdate(
       req.params.id,req.body,{
           new:true,
           runValidators: true

       }
   )
      
      res.status(200).json({
          success:true,
          data : course
      })
  
  });


 //Desc Delete a course
//Method DELETE /api/v1/courses/:id

exports.deleteCourse = asyncMiddleware(async (req,res,next)=>{


 const course = await Course.findById(req.params.id)
  
    if(!course){
      return  next (
          new ErrorResponse(`No course id in ${req.params.id}`,404));
  }
  

  if(course.user.toString() !== req.user.id && req.user.role !=='admin'){
    return  next (
        new ErrorResponse(`User ${req.params.id} not authorized for Delete a Courses `,401));
}

   await course.remove();
      
      res.status(200).json({
          success:true,
          data : "The Course deleted successfully"
      })
  
  });
