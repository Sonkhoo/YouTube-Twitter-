import {Router} from "express";
import {loginUser, registerUser} from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middlewares.js";

const router = Router()

console.log("check 1");
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser) //main routing functionality is done here and user controller is called

router.route("/login").post(loginUser)

export default router