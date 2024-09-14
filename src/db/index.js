import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";
console.log(DB_NAME);
const connectDB = async ()=>{ //async method returns a promise so .then() and .catch() should be used
    try {
        const connectioninstance = await mongoose.connect(`${process.env.URL}/${DB_NAME}`,{serverSelectionTimeoutMS: 5000})
        console.log(`MongoDB connected ! ${connectioninstance.connection.host}`); // connectioninstance will show you different connection details like which database it is connected to etc
    } catch (error) {
        console.log("MongoDB connection failed",error);
        process.exit(1) // there are different exit codes and process is a node function (read about it)
    }
}

export default connectDB