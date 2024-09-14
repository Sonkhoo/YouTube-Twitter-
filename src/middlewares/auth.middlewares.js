/*
to add new object req.user to the req.body using middleware which will store the user info in the body so tht user doesnt have to enter his info during logout. 
*/

import apiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        req.cookies?.access
    } catch (error) {
        throw new apiError(404,"Error in verifying JWT")
    }
})