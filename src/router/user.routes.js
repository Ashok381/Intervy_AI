import {Router} from "express";
import { getUserInfo, loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middleWare/auth.middleware.js";

const userRouter = Router() ; 
userRouter.route("/register").post(registerUser) ; 
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post( verifyJwt  , logOutUser)
userRouter.route('/info').post(verifyJwt , getUserInfo)
export default userRouter ; 