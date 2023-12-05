import { NextResponse } from "next/server";
import connectDB from "../../../../connectDB";
import { cookies } from "next/headers";
import { jwtCheck } from "../../../../middelware/jwtFunc";
import { user } from "../../../../model/user";
import { project } from "../../../../model/project";


export async function GET(req){

    await connectDB()

    try {
        
        const token = cookies().get("token")

        const jwtVerify = await jwtCheck(token)
        if(!jwtVerify){
            return NextResponse.json({success: false, message: "please login or re-login"},{status:400})
        }

        const userData = await user.findOne({_id: {$eq: jwtVerify._id}})

        if(!userData){
            return NextResponse.json({success: false, message: "user not found"}, {status: 400})
        }

        const projectData = await project.find({_id : {$in: userData.project}})

        return NextResponse.json({success: true, data: projectData})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal sever error"},{status: 500})
    }
}