//Desc Get all bootcamps
//Method GET /api/v1/bookcapms
//Access public

exports.getBootcamps=(req,res,next)=>{
    res.status(200).json({success:true,msg:'get all bootcamps'})
}

exports.getBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:`Get bootcamps ${req.params.id}`})
}

exports.createBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:'create a new bootcamp'})
}

exports.updateBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:`Update bootcamps ${req.params.id}`})
}

exports.deleteBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:`Delete  bootcamps ${req.params.id} `})
}