import { NextResponse } from "next/server";
import connectDB from "../../../../../../../connectDB";
import { cookies } from "next/headers";
import { jwtCheck } from "../../../../../../../middelware/jwtFunc";
import { user } from "../../../../../../../model/user";
import { project } from "../../../../../../../model/project";


export async function GET(req, {params}){

    await connectDB()

    try {
        
        const {projectId, issueId} = params

        const token = cookies().get("token")
        const  jwtVerify = await jwtCheck(token)
        if(!jwtVerify){
            return NextResponse.json({succcess: false, message: "please login or re-login"}, {status: 400})
        }

        const userData = await user.findOne({_id: {$eq: jwtVerify._id}})
        if(!userData){
            return NextResponse.json({success: false, message: "user not found"}, {status: 404})
        }

        const projectData = await project.findOne({_id: {$eq: projectId}}).populate([{path: "issues.issueAuther", select: "name email"}])
        if(!projectData){
            return NextResponse.json({success: false, message: "project not found"}, {status: 404})
        }

        if(projectData.auther.toString()!==userData._id.toString() && !projectData.team.includes(userData._id)){
            return NextResponse.json({success: false, message: "you can not authrized"}, {status: 400})
        }

        var issueData = null
        await projectData.issues.forEach(element => {
            if(element._id.toString() === issueId){
                issueData = element
            }
        });

        console.log(issueData)

        if(!issueData){
            return NextResponse.json({success: false, message: "issue not found"}, {status: 400})
        }

        return NextResponse.json({success: true, issue: issueData, user: {id: userData._id}, projectManger: {id: projectData.auther}})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}

export async function PUT(req, {params}){

    await connectDB()

    try {
        
        const {projectId, issueId} = params
        const data = await req.json()
        const {message, issuesType, priority } = data

        const token = cookies().get("token")
        const  jwtVerify = await jwtCheck(token)
        if(!jwtVerify){
            return NextResponse.json({succcess: false, message: "please login or re-login"}, {status: 400})
        }

        const userData = await user.findOne({_id: {$eq: jwtVerify._id}})
        if(!userData){
            return NextResponse.json({success: false, message: "user not found"}, {status: 404})
        }

        const projectData = await project.findOne({_id: {$eq: projectId}}).populate([{path: "issues.issueAuther", select: "name email"}])
        if(!projectData){
            return NextResponse.json({success: false, message: "project not found"}, {status: 404})
        }

        if(projectData.auther.toString()!==userData._id.toString() && !projectData.team.includes(userData._id)){
            return NextResponse.json({success: false, message: "you can not authrized"}, {status: 400})
        }

        var issueIndex = -1
        await projectData.issues.forEach((element, index) => {
            if(element._id.toString() === issueId){
                issueIndex = index
            }
        });

        console.log(issueIndex)

        if(issueIndex===-1){
            return NextResponse.json({success: false, message: "issue not found"}, {status: 400})
        }

        if(projectData.auther.toString()!==userData._id.toString() && projectData.issues[issueIndex].issueAuther._id.toString() !== userData._id.toString()){
            return NextResponse.json({success: false, message: "you can not change other member issue"}, {status: 401})
        }

        if(message){
            projectData.issues[issueIndex].message = message
        }
        if(message){
            projectData.issues[issueIndex].issuesType = issuesType
        }
        if(message){
            projectData.issues[issueIndex].priority = priority
        }

        await projectData.save()

        return NextResponse.json({success: true, issue: projectData.issues[issueIndex], userId: userData._id})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}

export async function DELETE(req, {params}){

    await connectDB()

    try {
        
        const {projectId, issueId} = params

        const token = cookies().get("token")
        const  jwtVerify = await jwtCheck(token)
        if(!jwtVerify){
            return NextResponse.json({succcess: false, message: "please login or re-login"}, {status: 400})
        }

        const userData = await user.findOne({_id: {$eq: jwtVerify._id}})
        if(!userData){
            return NextResponse.json({success: false, message: "user not found"}, {status: 404})
        }

        const projectData = await project.findOne({_id: {$eq: projectId}}).populate([{path: "issues.issueAuther", select: "name email"}])
        if(!projectData){
            return NextResponse.json({success: false, message: "project not found"}, {status: 404})
        }

        if(projectData.auther.toString()!==userData._id.toString() && !projectData.team.includes(userData._id)){
            return NextResponse.json({success: false, message: "you can not authrized"}, {status: 400})
        }

        var issueIndex = -1
        await projectData.issues.forEach((element, index) => {
            if(element._id.toString() === issueId){
                issueIndex = index
            }
        });

        console.log(issueIndex)

        if(issueIndex===-1){
            return NextResponse.json({success: false, message: "issue not found"}, {status: 400})
        }

        if(projectData.auther.toString()!==userData._id.toString() && projectData.issues[issueIndex].issueAuther._id.toString() !== userData._id.toString()){
            return NextResponse.json({success: false, message: "you can not change other member issue"}, {status: 401})
        }

        projectData.issues.splice(issueIndex, 1)

        await projectData.save()

        return NextResponse.json({success: true, issue: projectData.issues})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
    }
}