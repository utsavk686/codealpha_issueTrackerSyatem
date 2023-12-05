import { NextResponse } from "next/server";
import connectDB from "../../../../../connectDB";
import bcrypt from "bcrypt"
import { user } from "../../../../../model/user";


export async function POST(req){

    await connectDB()

    try {
        
        const data = await req.json()
        const {name, email, password} = data

        if(!name || !email || !password){
            return NextResponse.json({success: false, message: "fill all field"}, {status: 400})
        }

        const userInDB = await user.findOne({email: {$eq: email}})

        if(userInDB){
            return NextResponse.json({success: false, message: "email already rgister"}, {status: 400})
        }

        const encryptPassword = await bcrypt.hash(password, 10)

        const userData = await user.create({name: name, email: email , password: encryptPassword})

        userData.password = "******"

        return NextResponse.json({success: true, message: "User created", data: userData})

    } catch (error) {
        
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}