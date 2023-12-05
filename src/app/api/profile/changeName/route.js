import { NextResponse } from "next/server";
import connectDB from "../../../../../connectDB";
import { cookies } from "next/headers";
import { jwtCheck } from "../../../../../middelware/jwtFunc";
import { user } from "../../../../../model/user";


export async function PUT(req){

    await connectDB()

    try {

        const data = await req.json()
        const {name} = data
        
        const token = cookies().get("token")
        const jwtVerify = jwtCheck(token)
        if(!jwtVerify){
            return NextResponse.json({success: false, message: "please login or re-login"}, {status: 400})
        }

        if(!name){
            return NextResponse.json({success: false, message: "enter name"}, {status: 400})
        }

        const userData = await user.findOne({_id: {$eq: jwtVerify._id}})

        userData.name = name
        await userData.save()

        return NextResponse.json({success: true, data: userData})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}