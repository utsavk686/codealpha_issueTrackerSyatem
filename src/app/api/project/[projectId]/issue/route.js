import { NextResponse } from "next/server";
import connectDB from "../../../../../../connectDB"
import { cookies } from "next/headers";
import { jwtCheck } from "../../../../../../middelware/jwtFunc";
import { user } from "../../../../../../model/user";
import { project } from "../../../../../../model/project";


export async function GET(req, {params}){

    await connectDB()

    try {
        
        const {projectId} = params

        const token = cookies().get("token")
        const  jwtVerify = await jwtCheck(token)
        if(!jwtVerify){
            return NextResponse.json({succcess: false, message: "please login or re-login"}, {status: 400})
        }

        const userData = await user.findOne({_id: {$eq: jwtVerify._id}})
        if(!userData){
            return NextResponse.json({success: false, message: "user not found"}, {status: 404})
        }

        const projectData = await project.findOne({_id: {$eq: projectId}})
        if(!projectData){
            return NextResponse.json({success: false, message: "project not found"}, {status: 404})
        }

        if(projectData.auther.toString()!==userData._id.toString() && !projectData.team.includes(userData._id)){
            return NextResponse.json({success: false, message: "you can not authrized"})
        }

        const data = await project.findOne({_id: {$eq: projectId}}).populate([{path: "issues.issueAuther", select: "name email"}])

        return NextResponse.json({success: true, issues: data.issues})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}