import { NextResponse } from "next/server";
import connectDB from "../../../../../connectDB";
import { cookies } from "next/headers";
import { jwtCheck } from "../../../../../middelware/jwtFunc";
import { user } from "../../../../../model/user";
import { project } from "../../../../../model/project";


export async function GET(req, { params }) {

    await connectDB()

    try {

        const { projectId } = params

        const token = cookies().get("token")
        const jwtVerify = await jwtCheck(token)
        if (!jwtVerify) {
            return NextResponse.json({ success: false, message: "please login or re-login" }, { status: 400 })
        }

        const userData = await user.findOne({ _id: { $eq: jwtVerify._id } })
        if (!userData) {
            return NextResponse.json({ success: false, message: "user not found" }, { status: 400 })
        }

        const projectData = await project.findOne({ _id: { $eq: projectId } })
        if (!projectData) {
            return NextResponse.json({ success: false, message: "project not found" }, { status: 400 })
        }

        if (projectData.auther.toString() !== userData._id.toString() && !projectData.team.includes(userData._id)) {
            return NextResponse.json({ success: false, message: "you can not athorized" }, { status: 400 })
        }

        const data =  await project.findOne({ _id: { $eq: projectId } }).populate([{path: "auther", select: "name email"},{path: "team", select: "name email"},{path: "issues.issueAuther", select: "name email"}])

        return NextResponse.json({ success: true, data: data, userId: userData._id })


    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(req, { params }) {

    await connectDB()

    try {

        const { projectId } = params
        const data = await req.json()
        console.log(data)
        const { title, description, link } = data

        const token = cookies().get("token")
        const jwtVerify = await jwtCheck(token)
        if (!jwtVerify) {
            return NextResponse.json({ success: false, message: "please login or re-login" }, { status: 400 })
        }

        if (!title && !description && !link) {
            return NextResponse.json({ success: false, message: "enter changed data" }, { status: 400 })
        }

        const userData = await user.findOne({ _id: { $eq: jwtVerify._id } })

        if (!userData) {
            return NextResponse.json({ success: false, message: "user not found" }, { status: 400 })
        }

        const projectData = await project.findOne({ _id: { $eq: projectId } })

        if (!projectData) {
            return NextResponse.json({ success: false, message: "project not found" }, { status: 400 })
        }

        if(!projectData.team.includes(userData._id) && projectData.auther.toString() !== userData._id.toString()){
            return NextResponse.json({ success: false, message: "you can not authrized" }, { status: 400 })
        }

        if (projectData.auther.toString() !== userData._id.toString()) {
            return NextResponse.json({ success: false, message: "only project manager update project data" }, { status: 400 })
        }

        const newProjectData = await project.findOneAndUpdate({ _id: { $eq: projectData._id } }, { title, description, link }, { new: true })

        return NextResponse.json({ success: true, data: newProjectData})

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}