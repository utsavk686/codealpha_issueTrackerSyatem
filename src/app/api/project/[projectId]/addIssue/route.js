import { NextResponse } from "next/server";
import connectDB from "../../../../../../connectDB";
import { project } from "../../../../../../model/project";
import { cookies } from "next/headers";
import { jwtCheck } from "../../../../../../middelware/jwtFunc";
import { user } from "../../../../../../model/user";



export async function PUT(req, {params}){

    await connectDB()

    try {
        
        const data = await req.json()
        const {message, issuesType, priority} = data
        const {projectId} = params

        const token = cookies().get("token")
        const jwtVerify = jwtCheck(token)
        if(!jwtVerify){
            return NextResponse.json({success: false, message: "please login or re-login"}, {status:400})
        }

        if(!message || !issuesType || !priority){
            return NextResponse.json({success: false, message: "fill all fiald"}, {status: 400})
        }

        const projectData = await project.findOne({_id: {$eq: projectId}})
        if(!projectData){
            return NextResponse.json({success: false, message: "project Not found"}, {status: 404})
        }

        const userData = await user.findOne({_id: {$eq: jwtVerify._id}})
        if(!userData){
            return NextResponse.json({success: false, message: "user not found"},{status:404})
        }

        if(!projectData.team.includes(userData._id) && projectData.auther.toString()!==userData._id.toString()){
            return NextResponse.json({success: false, message: "You can not access project"}, {status:401})
        }

        projectData.issues.push({
            message, issuesType, priority, issueAuther: userData._id
        })
        await projectData.save()

        return NextResponse.json({success: true, message: "issue added", data: projectData})


    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}