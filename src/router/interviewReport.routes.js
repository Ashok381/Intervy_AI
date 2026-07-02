import { Router } from "express";
import { verifyJwt } from "../middleWare/auth.middleware.js";
import { Apierror } from "../utils/Apierror.js";
import { upload } from "../middleWare/multer.js";
import { GenerateinterviewReportController, generateResumec, getAllInterviewReport } from "../controllers/interviewReport.controller.js";

const interviewRouter = Router() ; 

interviewRouter.route('/get-interviewReport').post(verifyJwt , (req , res , next)=>{
    if(req.user != null){
        next() 
    }
    else {
        next(new Apierror(401 , "unauthorized as accestoken is not valid or undefined ")) 
    }
} , upload.single("resume") , GenerateinterviewReportController )

interviewRouter.route('/get-AllgeneratedReport').post(verifyJwt , (req , res , next)=>{
    if(req.user != null ){
        next() 
    }
    else {
        next(new Apierror(401 , "unauthorized as accesstoken is not valid or undefined ")) 
    }
} , getAllInterviewReport )

interviewRouter.route('/generate-resume').post(verifyJwt , (req , res , next)=>{
    if(req.user != null){
        next() 
    }
    else {
        next(new Apierror(401 , "unauthorized as accestoken is not valid or undefined ")) 
    }
} , upload.single("resume") , generateResumec)

export {interviewRouter}