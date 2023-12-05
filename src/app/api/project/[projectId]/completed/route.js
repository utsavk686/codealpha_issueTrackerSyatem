import { NextResponse } from "next/server";
import connectDB from "../../../../../../connectDB";
import { cookies } from "next/headers";
import { jwtCheck } from "../../../../../../middelware/jwtFunc";
import { user } from "../../../../../../model/user";
import { project } from "../../../../../../model/project";


export async function PUT(req, {params}){

    await connectDB()

    try {
        
        const {projectId} = params

        const token = cookies().get("token")
        const jwtVerify = await jwtCheck(token)
        if(!jwtVerify){
            return NextResponse.json({success: false, message: "please login or re-login"}, {status: 400})
        }

        const userData = await user.findOne({_id: {$eq: jwtVerify._id}})
        if(!userData){
            return NextResponse.json({success: false, message: "user not found"}, {status: 400})
        }

        const projectData = await project.findOne({_id: {$eq: projectId}})
        if(!projectData){
            return NextResponse.json({success: false, message: "project not found"}, {status: 400})
        }

        if(userData._id.toString() !== projectData.auther.toString() && !projectData.team.includes(userData._id)){
            return NextResponse.json({success: false, message: "you can not authrized"}, {status: 401})
        }

        if(userData._id.toString() !== projectData.auther.toString()){
            return NextResponse.json({success: false, message: "only project manager access the completed project"}, {status: 401})
        }

        if(projectData.isCompleted){
            return NextResponse.json({success: false, message: "project is already completed"}, {status: 400})
        }

        projectData.isCompleted = true
        await projectData.save()

        return NextResponse.json({success: true, data: projectData})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}

export async function DELETE(req, {params}){

    await connectDB()

    try {
        
        const {projectId} = params

        const token = cookies().get("token")
        const jwtVerify = await jwtCheck(token)
        if(!jwtVerify){
            return NextResponse.json({success: false, message: "please login or re-login"}, {status: 400})
        }

        const userData = await user.findOne({_id: {$eq: jwtVerify._id}})
        if(!userData){
            return NextResponse.json({success: false, message: "user not found"}, {status: 400})
        }

        const projectData = await project.findOne({_id: {$eq: projectId}})
        if(!projectData){
            return NextResponse.json({success: false, message: "project not found"}, {status: 400})
        }

        if(userData._id.toString() !== projectData.auther.toString() && !projectData.team.includes(userData._id)){
            return NextResponse.json({success: false, message: "you can not authrized"}, {status: 401})
        }

        if(userData._id.toString() !== projectData.auther.toString()){
            return NextResponse.json({success: false, message: "only project manager access the completed project"}, {status: 401})
        }

        if(!projectData.isCompleted){
            return NextResponse.json({success: false, message: "project is already uncompleted"}, {status: 400})
        }

        projectData.isCompleted = false
        await projectData.save()

        return NextResponse.json({success: true, data: projectData})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}