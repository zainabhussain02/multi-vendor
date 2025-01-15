// const express = require("express");
// const path = require("path");
// const router = express.Router();
// const User = require("../model/user");
// const { upload } = require("../multer");
// const ErrorHandler = require("../utlis/ErrorHandler");
// const fs = require("fs");
// const jwt = require("jsonwebtoken");
// //create user
// router.post("/create-user", upload.single("file"), async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;
//     // Check if user already exists
//     const userEmail = await User.findOne({ email });
//     if (userEmail) {
//       const filename = req.file.filename;
//       const filePath = `uploads/${filename}`;

//       // Delete uploaded file if user exists
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json({ message: "Error deleting file" });  
//         } 
//         return next(new ErrorHandler("User already exists", 400));  // Make sure only one response is sent
//       });
//       return;  // Ensure the function exits here so no further responses are sent
//     }

//     // Proceed to create the new user
//     const filename = req.file.filename;
//     const fileUrl = path.join(filename);
//     const newUser = new User({
//       name: name,
//       email: email,
//       password: password,
//       avatar: fileUrl,
//     });
//     await newUser.save();
//     const activationToken = createActivationToken(newUser);
//     const activationUrl = `http://localhost:3000/activation/${activationToken}`;

//     try {
//       // Send email to user with activation link
//       await sendMail({
//         email: newUser.email,
//         subject: "Activate Your account",
//         message: `Hello ${newUser.name},\n\t Please click on the link below to activate your account:\n\n${activationUrl}`,
//       });

//       res.status(201).json({
//         success: true,
//         message: `Please check your email:-\n\t${newUser.email} to activate your account`,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 400));
//   }
// });
// // create activation token
// const createActivationToken = (user) => {
//   return jwt.sign(user, process.env.ACTIVATION_SECRET, {
//     expiresIn: process.env.ACTIVATION_EXPIRES,
//   });
// };
// module.exports = router;












const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../model/user");
const { upload } = require("../multer");
const ErrorHandler = require("../utlis/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const catchAsyncError=require("../middleware/catchAsyncErrors");
const sendMail=require("../utlis/sendMail");
const sendToken = require("../utlis/jwtToken");
 
// Create user route
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      // Delete uploaded file if user exists
      if (req.file) {
        const filename = req.file.filename;
        const filePath = path.join(__dirname, "../uploads", filename); // Corrected file path

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error deleting file" });
          }
        });
      }
      return next(new ErrorHandler("User already exists", 400)); // Ensure this error flows properly
    }

    // Proceed to create the new user
    const filename = req.file.filename;
    const fileUrl = path.join("uploads", filename); // Fixed relative path for the file
    const newUser = new User({
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    });
    await newUser.save();

    const activationToken = createActivationToken(newUser);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      // Send email to user with activation link
      await sendMail({
        email: newUser.email,
        subject: "Activate Your account",
        message: `Hello ${newUser.name},\n\t Please click on the link below to activate your account:\n\n${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${newUser.email} to activate your account`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Create activation token
const createActivationToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACTIVATION_SECRET, {
    expiresIn: process.env.ACTIVATION_EXPIRES,
  });
};


// activate user
router.post("/activation",catchAsyncError(async(req,res,next)=>{
  try {
    const {activation_token}=req.body;
const newUser=jwt.verify(activation_token,process.env.ACTIVATION_SECRET);

if(!newUser){
  return next(new ErrorHandler("Invalid token ",400))
}
const {name,email,password,avatar}=newUser;
let user= await User.findOne({email});
  if(user){
    return next(new ErrorHandler("User already exist",500));
  }
 user=await  User.create({
    name,
    email,
    password,
    avatar,
  });

  
  sendToken(user,201,res);
  } catch (error) {
    return next(new ErrorHandler(error.message,500));
  }
}))
module.exports = router;  


