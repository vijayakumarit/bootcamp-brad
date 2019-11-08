//Desc Get all bootcamps
//Method GET /api/v1/bookcapms
//Access public
const ErrorResponse = require ('../utils/errorResponse')
const Bootcamp = require ('../models/Bootcamp')
const geocoder = require('../utils/geocoder')
const asyncMiddleware = require('../middleware/async')

exports.getBootcamps = asyncMiddleware (async (req,res,next)=>{

    let query;

    const reqQuery = {...req.query}
    const pagination = ['page','limit']

    pagination.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 1;
    const startIndex = (page - 1)*limit;
    const endIndex = page*limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);
   
       const bootcamps = await query;

       //Pagination Result

       const paginationresult = {};

       if(endIndex < total){
        paginationresult.next ={
            page : page + 1,
            limit
        }

    }
       if(startIndex > 0){
        paginationresult.prev ={
            page : page - 1,
            limit
        }

       }

       res.status(200).json({success:true,count:bootcamps.length, paginationresult,data:bootcamps})
   
  
});

exports.getBootcamp = asyncMiddleware (async (req,res,next)=>{

   

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
   
});

exports.createBootcamp= asyncMiddleware (async (req,res,next)=>{
 
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data : bootcamp
    })

  


    
});

exports.updateBootcamp = asyncMiddleware (async (req,res,next)=>{

  
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

    if(!bootcamp){
        return  next (
            new ErrorResponse(`Bootcamp not found ${req.params.id}`,404));
    }

    res.status(200).json({
        success:true,
        data :bootcamp
    })

  
   
   
})

exports.deleteBootcamp = asyncMiddleware ( async (req,res,next)=>{
    
    
        const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp){
        return  next (
            new ErrorResponse(`Bootcamp not found ${req.params.id}`,404));
    }

  bootcamp.remove();

    res.status(200).json({
        success:true,
        data :"Successfully deleted"
    })

});

//GET data BY Radius
//@route GET/api/v1/bootcamps/radius/:zipcode/:distance

exports.getBootcampsInRadius = asyncMiddleware ( async (req,res,next)=>{


    const {zipcode,distance} = req.params;
 
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lon = loc[0].longitude;
//Earth radius 3693 miles
    const radius = distance / 3693;

    const bootcamps = await Bootcamp.find({
        location : { $geoWithin: { $centerSphere: [ [lon, lat], radius ] }}
    });

    res.status(200).json({
        result: true,
        count : bootcamps.length,
        data : bootcamps
    })

});