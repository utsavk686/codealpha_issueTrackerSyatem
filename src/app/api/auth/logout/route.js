import { NextResponse } from "next/server";
import connectDB from "../../../../../connectDB";
import { cookies } from "next/headers";


export async function GET(req){

    await connectDB()

    try {
        
        const token = cookies().get("token")
        if(!token){
            return NextResponse.json({success: false, message: "no account login, first login and than invoke logout"})
        }

        cookies().set({
            name: "token",
            value: "",
            maxAge: 0
        })

        return NextResponse.json({success: true, message: "Account logout"})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"})
    }
}