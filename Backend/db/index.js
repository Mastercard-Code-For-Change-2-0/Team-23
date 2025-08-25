import mongoose from 'mongoose';

const connectDB = async() =>{
    try{
        const dbInstance = await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log("DB connected");
        console.log("DB host:", dbInstance.connection.host);
    }catch(error){
        console.error("DB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;