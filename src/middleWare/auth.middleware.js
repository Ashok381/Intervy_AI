import jwt from "jsonwebtoken";
import { Apierror } from "../utils/Apierror.js";
import { User } from "../model/user.js";

const verifyJwt = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        console.log("refresh Token is expired")
        req.refreshToken =null; 
        req.user = null ; 
        return next();

    }
     req.refreshToken = refreshToken ; 
    if (!accessToken) {
        console.log("accessToken is expired ")
        try {
            const decodeToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            req.user = null;
            req.id = decodeToken.id;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            return next(new Apierror(401, "Refresh token is invalid or expired"));
        }
    }

    try {
        const decodeToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodeToken.id);

        if (!user || user.refreshToken !== refreshToken) {
            console.log("user or refresh token is not matching ")
            return next(new Apierror(401, "Unauthorized !!"));
        }

        req.user = user;
        return next();
    } catch (error) {
        return next(new Apierror(401, "Access token is invalid or expired"));
    }
};

export { verifyJwt };