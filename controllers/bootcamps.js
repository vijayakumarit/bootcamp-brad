//Desc Get all bootcamps
//Method GET /api/v1/bookcapms
//Access public
const ErrorResponse = require ('../utils/errorResponse')
const Bootcamp = require ('../models/Bootcamp')

exports.getBootcamps = async (req,res,next)=>{
    try {
       const bootcamps = await Bootcamp.find()

       res.status(200).json({success:true,count:bootcamps.length,data:bootcamps})
    } catch (error) {
        next(error);
    }
  
}

exports.getBootcamp = async (req,res,next)=>{

    try {

    // var filters = {
    //     id: req.params.id,
    // };


        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            return  next (
                new ErrorResponse(`Bootcamp not found ${req.params.id}`,404));
        }

        res.status(200).json({
            success:true,
            data:bootcamp
        })
    } catch (error) {
        // res.status(400).json({
        //     status:false
        // })
        next(error);
        //new ErrorResponse(`Bootcamp not found ${req.params.id}`,404)
    }
}

exports.createBootcamp= async (req,res,next)=>{
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data : bootcamp
    })

  } catch (error) {
    next(error);
      
  }


    
}

exports.updateBootcamp = async (req,res,next)=>{

    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

    if(!bootcamp){
        return  next (
            new ErrorResponse(`Bootcamp not found ${req.params.id}`,404));
    }

    res.status(200).json({
        success:true,
        data :bootcamp
    })

    } catch (error) {
        next(error);
    }
   
   
}

exports.deleteBootcamp = async (req,res,next)=>{
    
    try {
        const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id)

    if(!bootcamp){
        return  next (
            new ErrorResponse(`Bootcamp not found ${req.params.id}`,404));
    }

    res.status(200).json({
        success:true,
        data :"Successfully deleted"
    })

    } catch (error) {
        next(error);
    }
}