import { NextResponse } from "next/server";
import connectDB from "../../../../../connectDB";
import { cookies } from "next/headers";
import { user } from "../../../../../model/user";
import sendEmail from "../../../../../middelware/sendEmail";


export async function PUT(req){

    await connectDB()

    try {
        
        const data = await req.json()
        const {email} = data

        const userData = await user.findOne({email: {$eq: email}})
        if(!userData){
            return NextResponse.json({success: false, message: "user not found"},{status: 404})
        }

        const otp = Math.floor( Math.random() * (999999 - 111111) + 111111 )

        const sendOtp = await sendEmail(userData.email, "Reset password", `password reset OTP is ${otp}`)

        if(!sendOtp){
            return NextResponse.json({success: false, message: "Otp not send on your email"}, {status: 500})
        }

        const currentTime = new Date()

        cookies().set({
            name: "resetEmail",
            value: userData.email,
            httpOnly: true,
            secure: true,
            maxAge: 60*20*1000
        })

        userData.resetOtp = otp
        userData.resetTime = currentTime.getTime() + 900000
        await userData.save()

        return NextResponse.json({success: true, message: "Otp send on your email"})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}