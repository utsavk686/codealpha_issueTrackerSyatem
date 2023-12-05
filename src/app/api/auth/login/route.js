import { NextResponse } from "next/server";
import connectDB from "../../../../../connectDB";
import { user } from "../../../../../model/user";
import bcrypt from "bcrypt";
import { cookies } from 'next/headers'
import { jwtCreate } from "../../../../../middelware/jwtFunc";


export async function POST(req) {

    await connectDB()

    try {

        const data = await req.json()
        const { email, password } = data

        const userData = await user.findOne({ email: { $eq: email } }).select("+password")

        if (!userData) {
            return NextResponse.json({ success: false, message: "wrong email or password" }, { status: 400 })
        }

        const isPasswordCheck = await bcrypt.compare(password, userData.password)

        if (!isPasswordCheck) {
            return NextResponse.json({ success: false, message: "wrong email or password" }, { status: 400 })
        }

        userData.password = "******"
        
        const token = jwtCreate({_id: userData._id})

        cookies().set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: true
        })

        return NextResponse.json({success: true, data: userData, token: token})

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Internal server error" }, {status: 500})
    }

}