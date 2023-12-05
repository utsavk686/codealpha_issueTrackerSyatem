import { NextResponse } from "next/server";
import connectDB from "../../../../../../connectDB";
import { cookies } from "next/headers";
import { jwtCheck } from "../../../../../../middelware/jwtFunc";
import { user } from "../../../../../../model/user";
import { project } from "../../../../../../model/project";


export async function PUT(req, {params}){

    await connectDB()

    try {
        
        const { projectId } = params
        const data = await req.json()
        const {memberEmail} = data 

        const token = cookies().get("token")
        const jwtVerify = await jwtCheck(token)
        if(!jwtVerify){
            return NextResponse.json({success: false, message: "please login or re-login"}, {status: 400})
        }

        const memberData = await user.findOne({email: {$eq: memberEmail}})
        if(!memberData){
            return NextResponse.json({success: false, message: "email not register"}, {status: 404})
        }

        const userData = await user.findOne({_id: {$eq: jwtVerify._id}})
        if(!userData){
            return NextResponse.json({success: false, message: "user not found"}, {status: 404})
        }

        const projectData = await project.findOne({_id: {$eq: projectId}})
        if(!projectData){
            return NextResponse.json({success: false, message: "project not found"}, {status: 404})
        }

        if(!projectData.team.includes(userData._id) && projectData.auther.toString()!==userData._id.toString()){
            return NextResponse.json({ success: false, message: "you can not authrized" }, { status: 400 })
        }

        if(projectData.auther.toString()!==userData._id.toString()){
            return NextResponse.json({success: false, message: "only project manager add team member"}, {status: 401})
        }

        if(userData._id.toString()===memberData._id.toString()){
            return NextResponse.json({success: false, message : "you are project manager and please not enter own email"}, {status: 400})
        }

        if(projectData.team.includes(memberData._id)){
            return NextResponse.json({success: false, message: "Email already in team"}, {status: 400})
        }

        projectData.team.push(memberData._id)
        await projectData.save()

        memberData.project.push(projectData._id)
        await memberData.save()

        return NextResponse.json({success: true, message: "Member added", data: projectData})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status:500})
    }
}


export async function DELETE(req, {params}){

    await connectDB()

    try {
        
        const { projectId } = params
        const data = await req.json()
        const {memberEmail} = data 

        const token = cookies().get("token")
        const jwtVerify = await jwtCheck(token)
        if(!jwtVerify){
            return NextResponse.json({success: false, message: "please login or re-login"}, {status: 400})
        }

        const memberData = await user.findOne({email: {$eq: memberEmail}})
        if(!memberData){
            return NextResponse.json({success: false, message: "email not register"}, {status: 404})
        }

        const userData = await user.findOne({_id: {$eq: jwtVerify._id}})
        if(!userData){
            return NextResponse.json({success: false, message: "user not found"}, {status: 404})
        }

        const projectData = await project.findOne({_id: {$eq: projectId}})
        if(!projectData){
            return NextResponse.json({success: false, message: "project not found"}, {status: 404})
        }

        if(!projectData.team.includes(userData._id) && projectData.auther.toString()!==userData._id.toString()){
            return NextResponse.json({ success: false, message: "you can not authrized" }, { status: 400 })
        }

        if(projectData.auther.toString()!==userData._id.toString()){
            return NextResponse.json({success: false, message: "only project manager remove team member"}, {status: 401})
        }

        if(userData._id.toString()===memberData._id.toString()){
            return NextResponse.json({success: false, message : "you are project manager and please not enter own email"}, {status: 401})
        }

        if(!projectData.team.includes(memberData._id)){
            return NextResponse.json({success: false, message: "Enater Email user not in your team member"}, {status: 400})
        }

        await projectData.team.splice(projectData.team.indexOf(memberData._id), 1)
        await projectData.save()

        await memberData.project.splice( memberData.project.indexOf(projectData._id), 1)
        await memberData.save()

        return NextResponse.json({success: true, message: "Member removed", data: projectData})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status:500})
    }
}