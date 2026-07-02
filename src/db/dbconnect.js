import mongoose from "mongoose";

async function connectDB(){
    try {
        const response =   await mongoose.connect(process.env.NODE_ENV === "production" ? process.env.MONGO_URI : process.env.MONGO_URI_DEV ) 
        console.log(response.connection.name) ;
        console.log("MongoDB connected successfully") ;
    } catch (error) {
        console.log("MongoDB connection failed") ;
        console.log(error) ; 
        throw error ;
    }
 
}

export default connectDB ;