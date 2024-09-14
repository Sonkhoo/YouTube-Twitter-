import app from "./app.js"
import dotenv from "dotenv"
import connectDB from './db/index.js'

dotenv.config({
    path: "../.env"
})
const Port = process.env.PORT
connectDB()
.then(()=>{
    app.on("Error",(error)=>{ //event listener for express (study)
        console.log("Express not being able to talk with DB", error);
    })
    app.listen(Port, ()=>{
        console.log(`Server is running on Port ${Port}`);
    })
})
.catch((error)=>{
    console.log();("MongoDB Connection error",error);
    process.exit(1)
})