import { NextResponse } from "next/server";
import connectDB from "../../../../connectDB";
import { cookies } from "next/headers";
import { jwtCheck } from "../../../../middelware/jwtFunc";
import { user } from "../../../../model/user";
import { project } from "../../../../model/project";


export async function POST(req){

    await connectDB()

    try {
        
        const data = await req.json()
        const {title, description, link} = data
       
        const token = cookies().get("token")
        const verifyToken = await jwtCheck(token)
        if(!verifyToken){
            return NextResponse.json({success: false, message: "please login or re-login"}, {status: 400})
        }

        if(!title || !description){
            return NextResponse.json({success: false, message: "fill all field"}, {status: 400})
        }

        const userData = await user.findOne({_id: {$eq: verifyToken._id}})

        if(!userData){
            return NextResponse.json({success: false, message: "user not found"}, {status: 400})
        }

        const projectData = await project.create({
            title: title,
            description: description,
            auther: userData._id,
            link: link,
        })

        userData.project.push(projectData._id)
        await userData.save()

        return NextResponse.json({success:true, data: projectData})


    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"},{status:500})
    }

}