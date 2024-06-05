import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationModel.js";
import cloudinary from "cloudinary";

export const postApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Employer"){
        return next(new ErrorHandler("Employer not allowed to access this resource",400))
    };
    if(req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Resume File Required!",400));
    }
    const {resume} = req.files;
    const allowedFormats = ["image/png","image/jpeg","image/webp"];
    if(!allowedFormats.includes(resume.mimetype)){
        return next(new ErrorHandler("Invalid File Type",400))
    }
    const clodinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath);
    if(!clodinaryResponse || clodinaryResponse.error){
        console.error("cloudinary Error :", clodinaryResponse.error || "Unknown Cloudinary Error");
        return next(new ErrorHandler("Failed to upload Resume to Cloudinary",500))
    }
})

export const employerGetAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker not allowed to access this resource",400))
    };
    const {_id} = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({success:true,applications})
})
export const jobseekerGetAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Employer"){
        return next(new ErrorHandler("Employer not allowed to access this resource",400))
    };
    const {_id} = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({success:true,applications})
})

export const jobseekerDeleteApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Employer"){
        return next(new ErrorHandler("Employer not allowed to access this resource",400))
    };
    const {id} = req.params;
    const applications = await Application.findByIdAndDelete(id);
    res.status(200).json({success:true,message:"Application Deleted Successfully!",applications})
})