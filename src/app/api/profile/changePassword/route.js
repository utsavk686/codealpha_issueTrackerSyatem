import { NextResponse } from "next/server";
import connectDB from "../../../../../connectDB";
import { cookies } from "next/headers";
import { user } from "../../../../../model/user";
import bcrypt from "bcrypt"


export async function PUT(req){

    await connectDB()

    try {
        
        const email = cookies().get("resetEmail")
        if(!email){
            return NextResponse.json({success: false, message: "OTP email not set"}, {status: 400})
        }

        const data =  await req.json()
        const {otp,password} = data

        const userData = await user.findOne({email: {$eq: email.value}}).select("+resetOtp +resetTime +password")

        if(!userData){
            return NextResponse.json({success: false, message: "user not found"}, {status:400})
        }

        if(!userData.resetOtp || !userData.resetTime){
            return NextResponse.json({success: false, message: "Otp not set with email"}, {status:400})
        }

        const currentTime = new Date()

        if(currentTime > userData.resetTime){
            return NextResponse.json({success: false, message: "OTP expiar"}, {status:400})
        }

        if(userData.resetOtp !== otp){
            return NextResponse.json({success: false, message: "Wrong OTP"}, {status:400})
        }

        const encryptPassword = await bcrypt.hash(password, 10)

        userData.password = encryptPassword
        userData.resetOtp = null
        userData.resetTime = null
        await userData.save()

        cookies().set({
            name: "resetEmail",
            value: "",
            httpOnly: true,
            secure: true,
            maxAge: 0
        })

        return NextResponse.json({success: true, message: "Password changed"})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}