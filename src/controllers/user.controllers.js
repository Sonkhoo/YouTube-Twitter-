import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import User from "../models/user.models.js";
import uploadCloudinary from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";
import fs from "fs";
//register user logic is written here

const generateAccessandRefreshToken = async(userId)=>{
    try {
        const user =await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new apiError(500,"Something went wrong while generating tokens")
    }
}
const registerUser = asyncHandler(async (req, res)=>{
        /*
        1. Take user information from frontend
        2. Take the user files upload using multer and then upload it in cloudinary then delete the file in disk storage
        3. Check if the user has filled all the necessary fields
        4. check if any user with that email or username already exists or not
        5. call database and generate user object
        6. Generate refresh and access token for the user 
        7. Remove the password and refresh token from the object and send it to the frontend
        7. Give success response on registeration and detailed output to the user
        */

        const {username, email, fullname, avatar, coverimage, password} = req.body
        //console.log(`Email:${email}`);

        if([fullname, email, username, password].some((fields)=>{ return fields?.trim()==""})){
            throw new apiError(400,"All fields are required")
        }
        // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if(!emailPattern.test(email)){
        //     throw new apiError(400,"Email must be valid")
        // }
        const checkUser = await User.findOne({
            $or: [{ username: username }, { email: email }]
          });
          
        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverimage?.[0]?.path;


        if (checkUser) {
            if (avatarLocalPath) fs.unlinkSync(avatarLocalPath);
            if (coverImageLocalPath) fs.unlinkSync(coverImageLocalPath);
            throw new apiError(409,"User with email or username already exists")
        }
        // console.log("Req.files",req.files);
        // console.log("Req.files.avatar",req.files.avatar);

        if(!avatarLocalPath){
            throw new apiError(400,"Avatar File is required")
        }

        const cloudinaryAvatar = await uploadCloudinary(avatarLocalPath)
        let  cloudinaryCoverImage=""

        if(coverImageLocalPath){
        cloudinaryCoverImage = await uploadCloudinary(coverImageLocalPath)
        }

        console.log("Cloudinary coverImage check", cloudinaryCoverImage);

        if(!cloudinaryAvatar){
            throw new apiError(400,"Avatar File is required")
        }

        const user =  await User.create({
            fullname,
            avatar: cloudinaryAvatar.url,
            coverimage: cloudinaryCoverImage?.url || "",
            email: email.toLowerCase(),
            password,
            username: username.toLowerCase()
        })
        //console.log("user reference:", user);

        const createdUser= await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new apiError(500,"Registering User failed")
        }
        
        res.status(201).json(
            new apiResponse(200, createdUser, "User registered")
        )
    })

const loginUser =asyncHandler(async(req,res)=>{
    /*
    1. getting user details from the frontend
    2. checking if user already exists in the database
    3. password check
    4. generating access token and refresh token
    5. send cookies to the user
    6. sucessfully log in the user
    */

    const {email, username, password}= req.body
    console.log("Email",email);
    if(!username || !email){
        throw new apiError(400, "Username or Email is rerquired")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new apiError(400, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401, "Invalid Password")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id)

    const loggedinUser = await User.findById(user._id)
    .select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken",accessToken, options) //adding refresh and access token to cookies
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(200,{
            user: loggedinUser, accessToken, refreshToken //alada kore send korchi karon user locally store korte chaite pare for developping maybe mobile app( eta data field)
        },
            "User Logged in successfully"
        )



        
    )

})



/*
0. Find user without taking req from users
1. clear cookies
2. Reset refresh token
*/
const logoutUser = asyncHandler(async(req,res)=>{
    
})
export { 
    registerUser,loginUser 
}

/*
1. Password encrypt how?
2. jwt tokens
3. refreshtokens and accesstokens
4. understand from backend pov also from user pov
*/