import mongoose from "mongoose";

export default async function connectDB(){

    try {
        if(!mongoose.connection.readyState){
            const mongo = await mongoose.connect(process.env.MONGO_URI)
            console.log(`DataBase Connected with ${mongo.connection.host}`)
        }else{
            console.log(`connection: ${mongoose.connection.host}`)
        }

    } catch (error) {
        console.log(error)
    }

}