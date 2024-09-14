import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//Middlewares

app.use(cors({ //STUDY ABOUT CORS
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"})) //form data
app.use(express.urlencoded({extended: true, limit: "16kb"})) //url data
app.use(express.static("public")) //to store some images or favicons etc
app.use(cookieParser()) //using cookie-parser


//importing routes

import router from "./routes/user.routes.js"

//routes declaration 

app.use("/api/users", router) //standard practice to call the user router

// http://localhost:3001/api/v1/users/register

export default app