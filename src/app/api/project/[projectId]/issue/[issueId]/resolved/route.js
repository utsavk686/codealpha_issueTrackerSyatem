import { NextResponse } from "next/server";
import connectDB from "../../../../../../../../connectDB";
import { cookies } from "next/headers";
import { jwtCheck } from "../../../../../../../../middelware/jwtFunc";
import { user } from "../../../../../../../../model/user";
import { project } from "../../../../../../../../model/project";


export async function PUT(req, { params }) {

    await connectDB()

    try {

        const { projectId, issueId } = params

        const token = cookies().get("token")
        const jwtVerify = await jwtCheck(token)
        if (!jwtVerify) {
            return NextResponse.json({ success: false, message: "please login or re-login" }, { status: 400 })
        }

        const userData = await user.findOne({ _id: { $eq: jwtVerify._id } })
        if (!userData) {
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
        }

        const projectData = await project.findOne({ _id: { $eq: projectId } })
        if (!projectData) {
            return NextResponse.json({ success: false, message: "project not found" }, { status: 404 })
        }

        if (projectData.auther.toString() !== userData._id.toString() && projectData.team.includes(userData._id)) {
            return NextResponse.json({ success: false, message: "you can not access project" }, { status: 400 })
        }

        if (projectData.auther.toString() !== userData._id.toString()) {
            return NextResponse.json({ success: false, message: "only project manager access isses resolved" }, { status: 400 })
        }

        var issueIndex = -1;
        await projectData.issues.forEach((element, index) => {
            if (element._id.toString() === issueId) {
                issueIndex = index
                return;
            }
        });

        if (issueIndex===-1) {
            return NextResponse.json({ success: false, message: "issue not found" }, { status: 400 })
        }

        if (projectData.issues[issueIndex].isResolve) {
            return NextResponse.json({ success: false, message: "issue already solved" }, { status: 400 })
        }

        projectData.issues[issueIndex].isResolve = true
        await projectData.save()

        return NextResponse.json({ success: true, message: "issue resolved", data: projectData.issues[issueIndex] })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }

}



export async function DELETE(req, { params }) {

    await connectDB()

    try {

        const { projectId, issueId } = params

        const token = cookies().get("token")
        const jwtVerify = await jwtCheck(token)
        if (!jwtVerify) {
            return NextResponse.json({ success: false, message: "please login or re-login" }, { status: 400 })
        }

        const userData = await user.findOne({ _id: { $eq: jwtVerify._id } })
        if (!userData) {
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
        }

        const projectData = await project.findOne({ _id: { $eq: projectId } })
        if (!projectData) {
            return NextResponse.json({ success: false, message: "project not found" }, { status: 404 })
        }

        if (projectData.auther.toString() !== userData._id.toString() && projectData.team.includes(userData._id)) {
            return NextResponse.json({ success: false, message: "you can not access project" }, { status: 400 })
        }

        if (projectData.auther.toString() !== userData._id.toString()) {
            return NextResponse.json({ success: false, message: "only project manager access isses resolved" }, { status: 400 })
        }

        var issueIndex = -1;
        await projectData.issues.forEach((element, index) => {
            console.log(element._id.toString(), issueId)
            if (element._id.toString() === issueId) {
                issueIndex = index
                return;
            }
        });

        if (issueIndex === -1) {
            return NextResponse.json({ success: false, message: "issue not found" }, { status: 400 })
        }

        if (!projectData.issues[issueIndex].isResolve) {
            return NextResponse.json({ success: false, message: "issue already unsolved" }, { status: 400 })
        }

        projectData.issues[issueIndex].isResolve = false
        await projectData.save()

        return NextResponse.json({ success: true, message: "issue resolved", data: projectData.issues[issueIndex] })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }

}