const crypto = require('crypto')
const ErrorResponse = require ('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')
const User = require ('../models/User')
const asyncMiddleware = require('../middleware/async')



//Desc Register a new User
//Method POST /api/v1/auth/register
//Access public

exports.register = asyncMiddleware(async (req,res,next)=>{

   const {name,email,password,role}=req.body;

   const user = await User.create({
       name,
       email,
       password,
       role
   });

 
   setTokenResponse(user,200,res)
})


//Desc Login User
//Method POST /api/v1/auth/login
//Access public

exports.login = asyncMiddleware(async (req,res,next)=>{

    const {email,password}=req.body;


 //check user
   if(!email || !password){

return next(new ErrorResponse('Please enter the email and password',400))
   }

   const user = await User.findOne({email}).select('+password');

   if(!user){
    return next(new ErrorResponse('Invalis Credentials',401))
   }

   const isMatch = await user.matchPassword(password);

   if(!isMatch){
    return next(new ErrorResponse('Invalis Credentials',401))
   }
 
   setTokenResponse(user,200,res)
 })
 



//Desc Current logout  User / clear cookies 
//Method GET /api/v1/auth/logout
//Access private

exports.logout = asyncMiddleware(async (req,res,next)=>{

  res.cookie('token','none',{

    expires:new Date(Date.now()+10*1000),
    httpOnly:true

  })

  res.status(200).json({
    success: true,
    data : "logout successfully"
  })
})




//Desc Current login  User
//Method POST /api/v1/auth/me
//Access private

exports.getMe = asyncMiddleware(async (req,res,next)=>{

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data : user
  })
})



// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncMiddleware(async (req, res, next) => {

 
  const fieldsToUpdate = {
    $set:{
    name: req.body.name
    }
  };
  

  const user = await User.findByIdAndUpdate(req.user.id,fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});


// @desc      Update Password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncMiddleware(async (req, res, next) => {

  const user = await User.findById(req.user.id).select('+password');
 
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

 user.password = req.body.newPassword;
 await user.save();

 setTokenResponse(user,200,res)
});

//Desc forgot password
//Method POST /api/v1/auth/forgotpassword
//Access private

exports.forgotPassword = asyncMiddleware(async (req,res,next)=>{

  const user = await User.findOne({email:req.body.email});

  if(!user){
    return next(new ErrorResponse(`The user mail does not matched`,404))
  }

  const resetToken = user.getResetPasswordToken(); 


 await user.save({validateBeforeSave:false})

   // Create reset url
   const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }


  res.status(200).json({
    success: true,
    data : user
  })
})



// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncMiddleware(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  setTokenResponse(user, 200, res);
});

//Get token from the model create a cookie send response

const setTokenResponse = (user,statusCode,res) =>{

  const token = user.getSignedJwtToken();
  const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };

    //producation secure 

    if(process.env.NODE_ENV === 'production'){

  options.secure = true
    }

    console.log(options)
  res
  .status(statusCode)
  .cookie('token',token,options)
  .json({
      success : true,
      token
  })
}



// // Get token from model, create cookie and send response
// const sendTokenResponse = (user, statusCode, res) => {
//   // Create token
//   const token = user.getSignedJwtToken();

//   const options = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true
//   };

//   if (process.env.NODE_ENV === 'production') {
//     options.secure = true;
//   }

//   res
//     .status(statusCode)
//     .cookie('token', token, options)
//     .json({
//       success: true,
//       token
//     });
// };