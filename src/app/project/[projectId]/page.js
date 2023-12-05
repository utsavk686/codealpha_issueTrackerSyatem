"use client"
import AddIssueForm from '@/components/AddIssueForm'
import IssueList from '@/components/IssueList'
import LoadingUi from '@/components/LoadingUi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import TeamAccordion from '@/components/TeamAccordion'

export default function Page({ params }) {

    const [projectData, setProjectData] = useState("")
    const [formData, setFormData] = useState("")
    const [userId, setUserId] = useState('')
    const [isUpdate, setIsUpdate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [change, setChange] = useState(false)
    const routes = useRouter()

    const getProjectInfo = async () => {
        setLoading(true)
        const fetchData = await fetch(`http://localhost:3000/api/project/${params.projectId}`, {
            method: "GET",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            }
        })
        const data = await fetchData.json()
        console.log(data)
        if (data.success) {
            setProjectData(data.data)
            setFormData({
                title: data.data.title,
                description: data.data.description,
                link: data.data.link
            })
            setUserId(data.userId)
        } else {
            toast.error(data.message.toUpperCase())
        }
        setLoading(false)
    }

    useEffect(() => {
        getProjectInfo()
    }, [change])

    const addMemberHandler = async () => {
        setLoading(true)
        const addMemberEmail = prompt("Enter member email: ")
        if (!addMemberEmail) {
            toast.info("member not add".toUpperCase())
            setLoading(false)
            return
        }
        const fetchData = await fetch(`http://localhost:3000/api/project/${projectData._id}/member`, {
            method: "PUT",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            },
            body: JSON.stringify({
                memberEmail: addMemberEmail
            })
        })
        const data = await fetchData.json()
        if (data.success) {
            toast.success("Add member".toUpperCase())
        } else {
            toast.error(data.message.toUpperCase())
        }
        setChange(!change)
        setLoading(false)
    }

    const updateHandler = async (e) => {
        e.preventDefault();
        setLoading(true)
        const fetchData = await fetch(`http://localhost:3000/api/project/${projectData._id}`, {
            method: "PUT",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            },
            body: JSON.stringify({
                title: formData.title,
                description: formData.description,
                link: formData.link
            })
        })
        const data = await fetchData.json()
        if (data.success) {
            toast.success("Project updated".toUpperCase())
            setIsUpdate(false)
        } else {
            toast.error(data.message.toUpperCase())
        }
        setChange(!change)
        setLoading(false)
    }

    const isCompleteHandler = async () => {
        setLoading(true)

        if (projectData.isCompleted) {
            const fetchData = await fetch(`http://localhost:3000/api/project/${projectData._id}/completed`, {
                method: "DELETE",
                headers: {
                    "content-type": "appliction/json; charset=UTF-8",
                }
            })
            const data = await fetchData.json()
            if (data.success) {
                toast.success("Project incomplete".toUpperCase())
            } else {
                toast.error(data.message.toUpperCase())
            }
        } else {
            const fetchData = await fetch(`http://localhost:3000/api/project/${projectData._id}/completed`, {
                method: "PUT",
                headers: {
                    "content-type": "appliction/json; charset=UTF-8",
                }
            })
            const data = await fetchData.json()
            if (data.success) {
                toast.success("Project complete".toUpperCase())
            } else {
                toast.error(data.message.toUpperCase())
            }
        }
        setChange(!change)
        setLoading(false)
    }

    const findIssue = () => {
        const id = prompt("Enter issue id: ")
        if (!id) {
            return
        }
        routes.push(`/project/${projectData._id}/${id}`)
    }

    return (
        (!projectData) ?
            <center>
                <p className='text-2xl text-gray-500 font-bold'>
                    Fetch Data
                </p>
            </center>
            :
            <center className="mt-8 mb-16" >
                {(loading) ? <LoadingUi /> : ""}
                <div className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Project: {projectData.title}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Id: {projectData._id}
                        </p>
                    </div>
                    {
                        (isUpdate) ?
                            <form onSubmit={updateHandler} className="border-t border-gray-200 text-left">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Title
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <input type='text'
                                                className='bg-indigo-200 rounded-md h-full w-full px-4 py-2'
                                                name="title"
                                                placeholder='Enter Title'
                                                value={formData.title}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, title: e.target.value })
                                                }}
                                            />
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Description
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <textarea type='text'
                                                rows={3}
                                                className='bg-indigo-200 rounded-md h-full w-full px-4 py-2'
                                                name="description"
                                                placeholder='Enter Description'
                                                value={formData.description}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, description: e.target.value })
                                                }}
                                            ></textarea>
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Link
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <input type='text'
                                                className='bg-indigo-200 rounded-md h-full w-full px-4 py-2'
                                                name="link"
                                                placeholder='Enter Link'
                                                value={formData.link}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, link: e.target.value })
                                                }}
                                            />
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Project manager
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {`${projectData.auther.name} (${projectData.auther.email})`} <span className='text-red-500'>{(userId.toString() === projectData.auther._id) ? "You" : ""}</span>
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Is complete
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {
                                                (projectData.isCompleted) ?
                                                    <p className='font-bold text-green-500'>TRUE</p> : <p className=' text-red-500'>FALSE</p>
                                            }
                                        </dd>
                                    </div>
                                    <div className="w-full">
                                        <button type='submit' className=' w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Update</button>
                                    </div>
                                </dl>
                            </form>
                            :
                            <div className="border-t border-gray-200 text-left">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Title
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {projectData.title}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Description
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {projectData.description}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Link
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {projectData.link}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Project manager
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {`${projectData.auther.name} (${projectData.auther.email})`} <span className='text-red-500'>{(userId.toString() === projectData.auther._id) ? "You" : ""}</span>
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Is complete
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {
                                                (projectData.isCompleted) ?
                                                    <p className='font-bold text-green-500'>TRUE</p> : <p className=' text-red-500'>FALSE</p>
                                            }
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                    }
                </div>
                <div className="mt-10">
                    {
                        (userId.toString() === projectData.auther._id) ?
                            <>
                                <button onClick={isCompleteHandler} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded me-6'>isComplete</button>
                                <button onClick={() => { setIsUpdate(!isUpdate) }} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded me-6'>{(isUpdate) ? "Not Update" : "Update"}</button>
                            </>
                            : ""

                    }
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={findIssue}>Find issue</button>
                </div>
                <div className="mt-10">
                    <div className='flex justify-between max-w-[600px] mt-4 mb-4 bg-sky-100 py-4 px-8'>
                        <div>
                            <p className='text-2xl mt-2 font-blod'>Team Member</p>
                        </div>
                        <div className='order-last'>
                            {
                                (userId.toString() === projectData.auther._id) ?
                                    <button onClick={addMemberHandler} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Add member</button>
                                    : ""
                            }
                        </div>
                    </div>
                    <div>
                        <TeamAccordion member={projectData.team} projectManager={projectData.auther._id} setChange={setChange} change={change} userId={userId} loading={loading} setLoading={setLoading} projectId={projectData._id} />
                    </div>
                </div>
                <div className="mt-10">
                    <Link href={`/project/${projectData._id}/issue`}>
                        <div className='flex justify-between max-w-[600px] mt-4 mb-4 bg-sky-100 py-4 px-6'>
                            <div>
                                <p className='text-2xl mt-2 font-blod'>Issues</p>
                            </div>
                        </div>
                    </Link>
                    <div>
                        <AddIssueForm projectId={projectData._id} setChange={setChange} change={change} />
                    </div>
                    <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" />
                    <div>
                        {
                            projectData.issues.map((element, index) => {
                                return <IssueList data={element} projectId={projectData._id} key={index} />
                            })
                        }
                    </div>
                </div>
            </ center>
    )
}
